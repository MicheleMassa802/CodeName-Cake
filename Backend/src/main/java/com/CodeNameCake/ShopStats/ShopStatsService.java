package com.CodeNameCake.ShopStats;

import com.CodeNameCake.Order.OrderService;
import com.CodeNameCake.OrdersCompleted.OrdersCompletedService;
import com.CodeNameCake.Shop.ShopService;
import com.CodeNameCake.User.UserService;
import com.CodeNameCake.User.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ShopStatsService {

    private final ShopStatsRepository shopStatsRepository;
    private final OrdersCompletedService ordersCompletedService;
    private final OrderService orderService;
    private final ShopService shopService;
    private final UserService userService;

    @Autowired
    public ShopStatsService(ShopStatsRepository shopStatsRepository, OrdersCompletedService ordersCompletedService,
            OrderService orderService, ShopService shopService, UserService userService) {
        this.shopStatsRepository = shopStatsRepository;
        this.ordersCompletedService = ordersCompletedService;
        this.orderService = orderService;
        this.shopService = shopService;
        this.userService = userService;
    }

    ////////////////
    // GET METHOD //
    ////////////////
    public ShopStatsResponse getShopTermStats(Long shopId, String term) {
        ShopStatsResponse response = new ShopStatsResponse();
        Optional<ShopStats> statsOptional = shopStatsRepository.findShopStatsByShopAndTerm(shopId, term);

        if (statsOptional.isPresent()) {
            response.setBasic(statsOptional.get());
            // set the completed orders
            response.setOrdersCompleted(
                    ordersCompletedService.getOrdersCompleted(response.getBasic().getCompletedOrdersListId()));
        } else {
            response.setBasic(new ShopStats());
            response.setOrdersCompleted(new ArrayList<>());
        }
        response.setOrdersCompletedLength(response.getOrdersCompleted().size());
        return response;
    }

    ///////////////////
    // DELETE METHOD //
    ///////////////////
    public void deleteAllShopStats(Long shopId) {
        // delete all stats related to the shopId given
        boolean validShop = shopService.shopExists(shopId);

        if (validShop) {
            List<ShopStats> statsToDelete = shopStatsRepository.findShopStatsByShopId(shopId);
            for (ShopStats row : statsToDelete) {
                shopStatsRepository.deleteById(row.getShopStatsId());
            }
        } else {
            throw new IllegalStateException("Shop with ID " + shopId + " does not exist");
        }
    }

    /////////////////
    // POST METHOD //
    /////////////////
    // Method to configure the stats for all missing terms in the database
    ///////////////// corresponding to this user's shop
    // once the user fires up the app after not using it for a while
    public Integer configureShopStats(Long userId) {

        // get user's corresponding shop ID
        User user = userService.getUser(userId);

        Long shopId = user.getShopId();

        // if a shop has no orders, then we cant configure stats for it
        String earliestOrderTerm = orderService.getEarliestOrderTerm(shopId);
        // this method checks for such condition within the order service

        // pull all the data of the shopStats that you have
        List<ShopStats> allShopStats = shopStatsRepository.orderShopStatsByTerm(shopId);

        // get the terms to fill
        List<String> termsToFill;

        if (allShopStats.size() == 0) {
            // no stats so far => get the earliest term from orders
            termsToFill = getMonthYearSequencesToFill(earliestOrderTerm, true);
        } else {
            termsToFill = getMonthYearSequencesToFill(allShopStats.get(0).getTerm(), false);
        }

        // configure their completed orders table
        ordersCompletedService.registerCompletedOrders(shopId, termsToFill);

        for (String term : termsToFill) {
            // get the order stats for that corresponding term (since last one filled until
            // the prev term)

            List<Object> termStats = getTermStats(shopId, term);

            // set characteristics accordingly and build the shopStats object
            ShopStats currStats = new ShopStats();
            currStats.setShopId(shopId);
            currStats.setCompletedOrdersListId(term + shopId);
            currStats.setTerm(term);
            currStats.setPopularOrderType((String) termStats.get(0));
            currStats.setBiggestOrder((Integer) termStats.get(1));
            currStats.setTotalOrderIncome((Integer) termStats.get(2));
            currStats.setBusinessLevel((double) termStats.get(3));

            // save the object
            shopStatsRepository.save(currStats);
        }

        // return # of terms caught up on
        return termsToFill.size();

    }

    ////////////////////
    // HELPER METHODS //
    ////////////////////
    public List<String> getMonthYearSequencesToFill(String latestMonthYear, boolean firstTimeShopStats) {
        List<String> monthYears = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-yyyy");
        YearMonth currentYearMonth = YearMonth.now();
        // take MM-YYYY str to Date format
        YearMonth latestYearMonth = YearMonth.parse(latestMonthYear, formatter);

        // if it is the first time creating shop stats, include the provided monthYear,
        // otw skip it
        if (firstTimeShopStats && latestYearMonth.isBefore(currentYearMonth)) {
            monthYears.add(latestMonthYear);
        }
        latestYearMonth = latestYearMonth.plusMonths(1);

        while (latestYearMonth.isBefore(currentYearMonth)) {
            // we don't add the current term, only the previous ones
            monthYears.add(latestYearMonth.format(formatter));
            latestYearMonth = latestYearMonth.plusMonths(1);
        }

        return monthYears;
    }

    public List<Object> getTermStats(Long shopId, String term) {
        // term is the term we calculate the business level for is the one specified in
        // the input
        // meaning all stats before that term are invalid when building up averages

        List<Object> termStats = new ArrayList<>();
        // of the format [popularOrderType, biggestOrder, totalIncome, businessLevel]

        // get the first 3 stats from the current term that you are analyzing from the
        // ordersCompleted class
        String popularOrderType = "";

        HashMap<String, Long> orderTypeToCount = orderService.getOrderTypeCount(shopId, term);
        // figure out max orderTypeCount
        Long maxValue = 0L;
        for (Map.Entry<String, Long> orderType : orderTypeToCount.entrySet()) {
            if (orderType.getValue() > maxValue) {
                popularOrderType = orderType.getKey();
                maxValue = orderType.getValue();
            }
        }

        Integer biggestOrder = orderService.getMaxShopTermOrderCost(shopId, term);
        Integer totalIncome = orderService.getShopTermIncome(shopId, term);

        double businessLevel;

        // get the past stats for the business level calculation

        // get the averages of totalOrderIncome
        List<Object[]> termTotalIncome = shopStatsRepository.getShopTermTotalIncome(shopId);

        double pastIncomeAverages;
        int currentTermIncome = orderService.getShopTermIncome(shopId, term);

        // average out those income totals
        double totalIncomeAvg = 0;
        int totalTerms = 0;
        for (Object[] termIncome : termTotalIncome) { // each object is [income, term]
            if (isBefore((String) termIncome[1], term)) { // when terms are the same or db term is over, not counted
                totalTerms += 1;
                totalIncomeAvg += ((Number) termIncome[0]).intValue();
                System.out.println("INFO " +
                        " total Terms " + totalTerms +
                        " term " + termIncome[1] +
                        " termIncome " + termIncome[0]);
            }

        }


        pastIncomeAverages = totalIncomeAvg / totalTerms;

        // Contrast these scores using the formula score = 100 + (your_score_this_term -
        // average_term_score)

        businessLevel = (currentTermIncome / pastIncomeAverages) * 100;

        // add each stat to the array in order and return
        termStats.add(popularOrderType);
        termStats.add(biggestOrder);
        termStats.add(totalIncome);
        termStats.add(businessLevel);

        return termStats;
    }

    public boolean isBefore(String term1, String term2) {
        // transform both "MM-YYYY" terms into dates and compare
        SimpleDateFormat dateFormat = new SimpleDateFormat("MM-yyyy");
        try {
            Date date1 = dateFormat.parse(term1);
            Date date2 = dateFormat.parse(term2);
            return date1.before(date2);
        } catch (ParseException e) {
            // Handle any potential parsing exception
            e.printStackTrace();
            return false;
        }
    }

}

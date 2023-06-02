package com.CodeNameCake.ShopStats;

import com.CodeNameCake.Shop.Shop;
import com.CodeNameCake.User.UserService;
import com.CodeNameCake.Shop.ShopRepository;
import com.CodeNameCake.User.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ShopStatsService {

    private final ShopStatsRepository shopStatsRepository;
    private final ShopRepository shopRepository;
    private final UserService userService;

    @Autowired
    public ShopStatsService(ShopStatsRepository shopStatsRepository, ShopRepository shopRepository,
                            UserService userService) {
        this.shopStatsRepository = shopStatsRepository;
        this.shopRepository = shopRepository;
        this.userService = userService;
    }


    ////////////////
    // GET METHOD //
    ////////////////
    public List<ShopStats> getShopStats() {
        return shopStatsRepository.findAll();
    }


    public ShopStats getShopTermStats(Long shopId, String term) {
        Optional<ShopStats> statsRow = shopStatsRepository.findShopStatsByShopAndTerm(shopId, term);

        if (statsRow.isPresent()) {
            return statsRow.get();
        } else {
            throw new IllegalStateException("Shop stats for shop with ID " + shopId + " during term "
                    + term + " does not exist");
        }
    }


    /////////////////
    // POST METHOD //
    /////////////////
    public void addShopStats(ShopStats shopStatRow) {
        // returns its ID that is to be sent with the user creation request
        shopStatsRepository.save(shopStatRow);  // no repeats to take care of

    }


    ///////////////////
    // DELETE METHOD //
    ///////////////////
    public void deleteAllShopStats(Long shopId) {
        // delete all stats related to the shopId given
        boolean validShop = shopRepository.existsById(shopId);

        if (validShop) {
            List<ShopStats> statsToDelete = shopStatsRepository.findShopStatsByShopId(shopId);
            for (ShopStats row : statsToDelete) {
                shopStatsRepository.deleteById(row.getShopStatsId());
            }
        } else {
            throw new IllegalStateException("Shop with ID " + shopId + " does not exist");
        }
    }


    // Method to configure the stats for all missing terms in the database corresponding to this user's shop
    // once the user fires up the app after not using it for a while
    public Integer configureShopStats(Long userId) {

        // get user's corresponding shop ID
        User user = userService.getUser(userId);

        Long shopId = user.getShopId();

        // pull all the data of the shopStats that you have
        List<ShopStats> allShopStats = shopStatsRepository.orderShopStatsByTerm(shopId);

        // get the terms to fill
        List<String> termsToFill = getMonthYearSequencesToFill(allShopStats.get(0).getTerm());

        for (String term : termsToFill) {
            // get the order stats for that corresponding term

            // set characteristics accordingly and build the shopStats object
            ShopStats currStats = new ShopStats();
            currStats.setShopId(shopId);
            currStats.setOrdersCompletedId(12L);
            currStats.setTerm(term);
            currStats.setPopularOrderType("Cake");
            currStats.setBiggestOrder(195);
            currStats.setTotalOrderIncome(1100);
            currStats.setBusinessLevel(102);

            // save the object
            shopStatsRepository.save(currStats);
        }

        // return # of terms caught up on
        return termsToFill.size();

    }

    public List<String> getMonthYearSequencesToFill(String latestMonthYear){
        List<String> monthYears = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-yyyy");
        YearMonth currentMonthYear = YearMonth.now();
        // take MM-YYYY str to Date format
        YearMonth latestYearMonth = YearMonth.parse(latestMonthYear, formatter);
        // skip the one that is the latest one on the DB
        latestYearMonth = latestYearMonth.plusMonths(1);

        while (latestYearMonth.isBefore(currentMonthYear)) {
            // we don't add the current term, only the previous ones
            monthYears.add(latestYearMonth.format(formatter));
            latestYearMonth = latestYearMonth.plusMonths(1);
        }

        return monthYears;
    }
}

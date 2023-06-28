package com.CodeNameCake.Order;

import com.CodeNameCake.OrderDetailField.OrderDetailField;
import com.CodeNameCake.OrderDetailField.OrderDetailFieldRequest;
import com.CodeNameCake.OrderDetailField.OrderDetailFieldService;
import com.CodeNameCake.Shop.Shop;
import com.CodeNameCake.Shop.ShopService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.sql.Date;
import java.time.ZoneId;
import java.util.*;
import java.util.List;

@Service
public class OrderService {

    private static final int PAST_ORDERS = 5;
    private static final int FUTURE_ORDERS = 10;

    private final OrderRepository orderRepository;
    private final OrderDetailFieldService orderDetailFieldService;
    private final ShopService shopService;

    @Autowired
    public OrderService(OrderRepository orderRepository, OrderDetailFieldService orderDetailFieldService,
                        ShopService shopService) {
        this.orderRepository = orderRepository;
        this.orderDetailFieldService = orderDetailFieldService;
        this.shopService = shopService;
    }



    ////////////////////
    // PDF GET METHOD //
    ////////////////////
    public void exportPDF(HttpServletResponse response, Long orderId){
        Document document = new Document(PageSize.A4);
        // get the order information based on orderId

        List<OrderResponse> orderResponseChain = getSpecificOrder(orderId);

        // get shopName through the order's shopId
        Shop orderShop = shopService.getShop(orderResponseChain.get(0).getBasic().getShopId());

        // write pdf from document to the response's output stream
        try {
            PdfWriter.getInstance(document, response.getOutputStream());

            // writing on doc
            document.open();


            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            titleFont.setSize(24);
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            subTitleFont.setSize(16);
            Font detailTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            subTitleFont.setSize(13);
            Font contentFont = FontFactory.getFont(FontFactory.HELVETICA);
            contentFont.setSize(13);

            Paragraph title = new Paragraph("Shop " + orderShop.getShopName() + " Order Receipt: " + orderId,
                    titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);

            Paragraph date = new Paragraph("Delivered On : " +
                    orderResponseChain.get(0).getBasic().getDeliveryDate().toString(), subTitleFont);
            date.setAlignment(Paragraph.ALIGN_LEFT);

            Paragraph blankLine = new Paragraph(" ");
            document.add(blankLine);

            // add title and date to doc
            document.add(title);
            document.add(blankLine);
            document.add(date);
            document.add(blankLine);
            document.add(blankLine);

            int orderNumber = 1;
            int totalCost = 0;
            for (OrderResponse order : orderResponseChain) {

                // make the required subheadings
                Paragraph subtitle = new Paragraph("Order Item # " + orderNumber, subTitleFont);
                subtitle.setAlignment(Paragraph.ALIGN_LEFT);

                // cost to the right
                Paragraph orderItemPrice = new Paragraph("Price: " + order.getBasic().getEstimatedCost(), contentFont);
                orderItemPrice.setAlignment(Paragraph.ALIGN_RIGHT);

                document.add(subtitle);
                document.add(orderItemPrice);
                document.add(blankLine);

                // order content
                Paragraph content;

                // -- basic details
                content = new Paragraph("--> " + order.getBasic().getOrderName() +
                        " ---- TYPE: " + order.getBasic().getOrderType(), contentFont);
                content.setAlignment(Paragraph.ALIGN_LEFT);
                document.add(content);
                document.add(blankLine);

                // get the beyond basic details in by groups:

                Optional<HashMap<String, HashMap<String, String>>> groupedDetailsOptional =
                        groupOrderDetails(order.getOrderDetails());
                HashMap<String, HashMap<String, String>> groupedDetails;

                if (groupedDetailsOptional.isPresent()) {
                    groupedDetails = groupedDetailsOptional.get();

                    // for each inner mapping, add its group name and its detail:value pairs

                    for (String groupName : groupedDetails.keySet()) {

                        content = new Paragraph("       " + groupName, detailTitle);
                        content.setAlignment(Paragraph.ALIGN_LEFT);
                        document.add(content);

                        // get the value (its respective property:value pairs) and add them
                        HashMap<String, String> group = groupedDetails.get(groupName);

                        for (String property : group.keySet()) {
                            content = new Paragraph("       " + property + " -- " + group.get(property),
                                    contentFont);
                            content.setAlignment(Paragraph.ALIGN_LEFT);
                            document.add(content);
                        }

                    }

                    document.add(blankLine);

                }
                // else : no order details to add, so just skip this section

                // update loop vars
                orderNumber += 1;
                totalCost += order.getBasic().getEstimatedCost();
            }

            // do a cross line
            document.add(blankLine);
            Paragraph resultLine = new Paragraph("----------------------------------------------------------" +
                    "--------------------------------------------------------------");
            resultLine.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(resultLine);
            document.add(blankLine);

            // Total Cost:
            Paragraph total = new Paragraph("Total: $", subTitleFont);
            total.setAlignment(Paragraph.ALIGN_LEFT);

            Paragraph totalPrice = new Paragraph(" " + totalCost, subTitleFont);
            totalPrice.setAlignment(Paragraph.ALIGN_RIGHT);

            document.add(total);
            document.add(totalPrice);

            // close doc
            document.close();

        } catch (IOException e) {
            System.out.println("Error generating receipt PDF");
            throw new RuntimeException(e);
        }

    }

    ////////////////
    // GET METHOD //
    ////////////////
    public List<List<OrderResponse>> getShopOrders(Long shopId, String term) {
        List<List<OrderResponse>> orderResponses = new ArrayList<>();
        // each inner list is a possible chain of orders, each outer list is a whole order

        List<Order> ordersPulled;

        if (term == null) {
            // perform search by shopId only
            ordersPulled = orderRepository.getOrdersByShopId(shopId);
        } else {
            // separate term into month and year
            String [] monthYear = term.split("-");  // results in ["month", "year"]
            ordersPulled = orderRepository.getTermOrdersByShopId(shopId, monthYear[1], monthYear[0]);
        }

        // traverse the pulled orders and order them into their respective List<OrderResponse> objects
        for (Order regularOrder : ordersPulled) {

            if (regularOrder.getAttachedFrontOrder() == null) {
                // we are on a front order
                List<Order> orderChain = getOrderChain(regularOrder);  // make up the order chain
                List<OrderResponse> orderResponseChain = new ArrayList<>();

                // for each order in the chain, pull the details and make the orderResponse object
                for (Order order : orderChain) {
                    OrderResponse orderResponse = new OrderResponse(order,
                            orderDetailFieldService.getOrderDetails(order.getOrderId()));
                    orderResponseChain.add(orderResponse);
                }

                // add the order response chain to the response
                orderResponses.add(orderResponseChain);

            }
            // otherwise skip
        }

        // once done with all order chains ordered, return
        return  orderResponses;

    }


    public List<Order> getTermShopOrders(Long shopId, String term) {
        String [] monthYear = term.split("-");  // results in ["month", "year"]
        return orderRepository.getTermOrdersByShopId(shopId, monthYear[1], monthYear[0]);
    }


    public List<OrderResponse> getSpecificOrder(Long orderId) {
        List<OrderResponse> orderResponseChain = new ArrayList<>();
        // each item of the list makes up the chain that is a full order

        Optional<Order> orderOptional = orderRepository.findById(orderId);
        Order frontOrder;

        if (orderOptional.isPresent()) {
            frontOrder = orderOptional.get();
        } else {
            throw new IllegalStateException("Order with ID " + orderId + " does not exist");
        }

        // set up the OrderResponse object based on the possible chain
        if (frontOrder.getAttachedFrontOrder() == null) {
            // we are on a front order
            List<Order> orderChain = getOrderChain(frontOrder);  // make up the order chain

            // for each order in the chain, pull the details and make the orderResponse object
            for (Order order : orderChain) {
                OrderResponse orderResponse = new OrderResponse(order,
                        orderDetailFieldService.getOrderDetails(order.getOrderId()));
                // add the current order to its response chain
                orderResponseChain.add(orderResponse);
            }

        }
        // otherwise skip (this technically won't happen as only front orders are displayed)

        // once done with all order chains ordered, return
        return  orderResponseChain;
    }


    public List<List<OrderResponse>> getRelevantShopOrders(Long shopId) {
        // get the shop orders in decreasing deliveryDate order
        List<List<OrderResponse>> sortedOrders = getShopOrders(shopId, null);

        if (sortedOrders.size() == 0) {
            return new ArrayList<>();
        }

        // start iterating through this list, and stop when you see today's date has passed (on the first element)

        List<List<OrderResponse>> closestDateOrders = new ArrayList<>();
        // fill the empty spaces of orders that don't meet the 10 / 5 requirement with empty lists

        // today's date
        LocalDate todayLocal = LocalDate.now();
        Date today = Date.valueOf(todayLocal);

        int firstPastIndex = sortedOrders.size();  // at most, no past orders are registered
        int i;
        for (i = 0; i < sortedOrders.size(); i++) {
            // get the order's date and check if it's before today (past)
            java.util.Date orderDate = sortedOrders.get(i).get(0).getBasic().getDeliveryDate();
            System.out.println("\n\n Today VS date: " + today + "---" + orderDate + "\n\n");
            if (orderDate.before(today)) {
                // order date is in the past, so break out of the loop
                firstPastIndex = i;
                break;
            }
            // otw you are still in future orders so keep looking
        }

        // get past orders
        int pastIndex = firstPastIndex;
        int pastCounter = 0;
        while (pastIndex < sortedOrders.size() && pastCounter < PAST_ORDERS) {
            // add past order
            closestDateOrders.add(sortedOrders.get(pastIndex));

            // go one further order into the past
            pastIndex += 1;
            pastCounter+= 1;
        }

        // check for if there's not enough past orders to fill in the first 5 spots
        for (int j = pastCounter; j < PAST_ORDERS; j++) {
            closestDateOrders.add(new ArrayList<>());
        }

        // get future orders
        int futureIndex = firstPastIndex - 1;
        int futureCounter = 0;
        while (futureIndex >= 0 && futureCounter < FUTURE_ORDERS) {
            // add future orders
            closestDateOrders.add(sortedOrders.get(futureIndex));

            // go one further order into the future
            futureIndex -= 1;
            futureCounter += 1;
        }

        // check if there's not enough future orders to fill in the last 10 spots
        for (int k = futureCounter; k < FUTURE_ORDERS; k++) {
            closestDateOrders.add(new ArrayList<>());
        }


        return closestDateOrders;
    }



    public HashMap<String, Long> getOrderTypeCount(Long shopId, String term) {
        String [] monthYear = term.split("-");  // results in ["month", "year"]
        List<Object[]> termOrderTypeCounts =
                orderRepository.countShopTermOrderTypes(shopId, monthYear[1], monthYear[0]);

        HashMap<String, Long> result = new HashMap<>();

        for (Object[] keyValuePair : termOrderTypeCounts) {
            result.put((String) keyValuePair[0], (Long) keyValuePair[1]);
        }
        return result;
        // keys should be: "Cake", "Cookies", "Cupcakes", "Other"
    }

    public int getMaxShopTermOrderCost(Long shopId, String term) {
        String [] monthYear = term.split("-");  // results in ["month", "year"]
        return orderRepository.getShopTermMaxCostOrder(shopId, monthYear[1], monthYear[0]);
    }

    public int getShopTermIncome(Long shopId, String term) {
        String [] monthYear = term.split("-");  // results in ["month", "year"]
        return orderRepository.getShopTermIncome(shopId, monthYear[1], monthYear[0]);
    }

    public String getEarliestOrderTerm(Long shopId) {

        Optional<java.util.Date> earliestOrderDate = orderRepository.getEarliestOrderTerm(shopId);
        if (earliestOrderDate.isPresent()) {
            java.util.Date earliestOrderDeliveryDate =earliestOrderDate.get();
            // get term from that date and return it
            SimpleDateFormat dateFormat = new SimpleDateFormat("MM-yyyy");
            return dateFormat.format(earliestOrderDeliveryDate);
        } else {
            throw new NoOrdersRecordedException();
        }

    }



    /////////////////
    // POST METHOD //
    /////////////////
    public void addOrder(OrderRequest order) {
        // order comes into the system as a combination of a couple entities, including the order attributes themselves,
        // and the OrderDetailField information, meaning that from this controller we perform the creation
        // of information for 2 different tables in the database which are all at heart the same entity.

        // so first I'll use the json following the format outlined on the application's notion page to create
        // the order object and save it

        LocalDate today = LocalDate.now();
        Date dateReceived = Date.valueOf(today);

        Order basicOrderObject = new Order(
                order.getBasic().getShopId(), order.getBasic().getOrderName(),
                dateReceived, order.getBasic().getDeliveryDate(),
                order.getBasic().getClientContact(), order.getBasic().getExtraNotes(),
                order.getBasic().getEstimatedCost(), order.getBasic().getOrderType(),
                order.getBasic().getAttachedFrontOrder(), order.getBasic().getAttachedFrontOrder()
        );

        orderRepository.save(basicOrderObject);

        // now we get the id of this order we just created, and now we can start adding order details

        Long orderId = basicOrderObject.getOrderId();

        List<OrderDetailFieldRequest> orderDetails = order.getOrderDetails();

        for (OrderDetailFieldRequest detailRequest : orderDetails) {

            // create an OrderDetailField object and add it to the database
            OrderDetailField orderDetail = new OrderDetailField(orderId, detailRequest.getFieldName(),
                    detailRequest.getFieldValue());

            orderDetailFieldService.addOrderDetail(orderDetail);

        }

        // method is done by the time all details are added
    }


    public void mergeOrders(Long orderId1, Long orderId2) {
        // fetch the two orders
        Optional<Order> order1Try = orderRepository.findById(orderId1);
        Optional<Order> order2Try = orderRepository.findById(orderId2);

        // get the two
        if (order1Try.isEmpty() || order2Try.isEmpty()) {
            // either order not present means error
            throw new IllegalStateException("One of the provided order Ids: " + orderId1 + " or " + orderId2 +
                    " does not correspond to a stored order ");
        } else {
            // both orders are objects in the db so link them
            Order order1 = order1Try.get();
            Order order2 = order2Try.get();
            linkOrderObjects(order1, order2);

        }

        // link successful
    }

    /* Linking the front of order2 to the end of order1.
    The preconditions for this function come from how the merging menu is structured in the FE:
    ->  order1 & order2 .getAttachedFrontOrder() must be NULL : as the only way an order is displayed in the
        FE is when they are at the front of their respective order chains.

     */
    public void linkOrderObjects(Order order1, Order order2) {

        // traverse until the end of the order1 chain

        Order tempOrder = order1;

        while (tempOrder.getAttachedNextOrder() != null) {
            // fetch the next attached order and check if it's the last in order1's chain
            Optional<Order> middleOrder = orderRepository.findById(tempOrder.getAttachedNextOrder());

            if (middleOrder.isPresent()) {
                tempOrder = middleOrder.get();
            } else {
                throw new IllegalStateException("Invalid order chain");
            }
        }

        // at this point, tempOrder is the last order in the order1 chain, so it's next must become
        // order2's id

        tempOrder.setAttachedNextOrder(order2.getOrderId());

        // set each of order2's chain of orders to have their .attachedFrontOrder to be order1.orderId
        Long newFront = order1.getOrderId();

        List<Order> ordersToUpdateChain2 = new ArrayList<>();
        Order tempOrder2 = order2;
        tempOrder2.setAttachedFrontOrder(newFront);
        ordersToUpdateChain2.add(tempOrder2);

        while (tempOrder2.getAttachedNextOrder() != null) {
            // fetch the next attached order and add it to the list until the order is null
            Optional<Order> middleOrder = orderRepository.findById(tempOrder2.getAttachedNextOrder());

            if (middleOrder.isPresent()) {
                // get, update the front, add to list
                tempOrder2 = middleOrder.get();
                tempOrder2.setAttachedFrontOrder(newFront);
                ordersToUpdateChain2.add(tempOrder2);
            } else {
                throw new IllegalStateException("Invalid order chain");
            }
        }

        // update the DB objects if you successfully get up to this point
        orderRepository.save(tempOrder);
        orderRepository.saveAll(ordersToUpdateChain2);

    }

    ///////////////////
    // DELETE METHOD //
    ///////////////////
    public void deleteOrder(Long orderId) {
        // this method can only be called with the orderId of the head of the orderChain as per how the FE works

        // get the first order
        Optional<Order> orderChainFront = orderRepository.findById(orderId);
        Order tempOrder;

        if (orderChainFront.isPresent()) {
            tempOrder = orderChainFront.get();
        } else {
            throw new IllegalStateException("Couldn't find head of the chain with id: " + orderId);
        }

        List<Order> orderChain = getOrderChain(tempOrder);

        // at this point all orders in the chain have been added to orderChain, so we now must get their
        // respective order details, delete those, and then delete the order objects
        for (Order order : orderChain) {
            orderDetailFieldService.deleteOrderDetail(order.getOrderId());
            orderRepository.delete(order);
        }

    }


    ////////////////
    // PUT METHOD //
    ////////////////
    public void updateOrder(List<OrderResponse> orderUpdater) {

        List<Order> updatedOrders = new ArrayList<>();
        List<List<OrderDetailField>> updatedOrderDetails = new ArrayList<>();

        // go through the list of orders
        for (OrderResponse fullOrder : orderUpdater) {

            // get the original order
            Optional<Order> originalOrder = orderRepository.findById(fullOrder.getBasic().getOrderId());
            Order updatedOrder;

            if (originalOrder.isPresent()) {
                // take the delivery date that might get updated and make it into a localdate
                LocalDate localDate = fullOrder.getBasic().getDeliveryDate().toInstant()
                                .atZone(ZoneId.systemDefault()).toLocalDate();

                // Create a new Date object without the time component
                Date resultDate = Date.valueOf(localDate);


                // update the fields of the basic order and those of the order details
                updatedOrder = originalOrder.get();
                // don't update id, or shopId, or dateReceived, or orderType, or attachedOrders
                updatedOrder.setOrderName(fullOrder.getBasic().getOrderName());
                System.out.println("HERE " + fullOrder.getBasic().getDeliveryDate().toString());
                updatedOrder.setDeliveryDate(resultDate);
                updatedOrder.setClientContact(fullOrder.getBasic().getClientContact());
                updatedOrder.setExtraNotes(fullOrder.getBasic().getClientContact());
                updatedOrder.setEstimatedCost(fullOrder.getBasic().getEstimatedCost());

                // add to the list of orders and orderDetails to update
                updatedOrders.add(updatedOrder);
                updatedOrderDetails.add(fullOrder.getOrderDetails());


            } else {
                throw new IllegalStateException("Order with ID " + fullOrder.getBasic().getOrderId()
                        + " does not exist");
            }

        }

        // save the changes (update the orders and orderDetails)
        for (int i = 0; i < updatedOrders.size(); i++) {
            orderRepository.save(updatedOrders.get(i));
            System.out.println(updatedOrders.get(i).toString());
            for (OrderDetailField orderDetail : updatedOrderDetails.get(i)) {
                // update each of the details for order i independently
                orderDetailFieldService.updateOrderDetail(orderDetail);
            }
        }
    }


    ///////////////////
    // HELPER METHOD //
    ///////////////////
    public List<Order> getOrderChain(Order order) {
        // retrieve the entire order chain in a list based on the .next attributes
        List<Order> orderChain = new ArrayList<>();

        orderChain.add(order);

        Order tempOrder = order;

        // for each new order in the chain until its end, add it to the chain to be deleted at the end
        while (tempOrder.getAttachedNextOrder() != null) {
            // fetch the next attached order and add it to the list until the order is null
            Optional<Order> middleOrder = orderRepository.findById(tempOrder.getAttachedNextOrder());

            if (middleOrder.isPresent()) {
                // get and add to list
                tempOrder = middleOrder.get();
                orderChain.add(tempOrder);
            } else {
                throw new IllegalStateException("Invalid order chain");
            }
        }

        return orderChain;

    }


    public Optional<HashMap<String, HashMap<String, String>>> groupOrderDetails (List<OrderDetailField> orderDetails) {

        if (orderDetails.size() == 0) {
            return Optional.empty();
        } else {

            // otherwise

            HashMap<String, HashMap<String, String>> groupedDetails = new HashMap<>();

            // for each detail, we split its name into its group and property with its corresponding value through the '--'

            for (OrderDetailField orderDetail : orderDetails) {
                String[] splitName = orderDetail.getFieldName().split(" -- ");  // returns [group, property]
                String propertyValue = orderDetail.getFieldValue();
                String groupName = splitName[0];
                String propertyName = splitName[1];

                // add a new key-value pair to the outer hashmap (a new group) if it's not already included
                if (!groupedDetails.containsKey(groupName)) {
                    HashMap<String, String> innerMap = new HashMap<>();
                    innerMap.put(propertyName, propertyValue);
                    groupedDetails.put(groupName, innerMap);
                } else {
                    groupedDetails.get(groupName).put(propertyName, propertyValue);
                }

            }
            return Optional.of(groupedDetails);

        }
    }


    // custom response status
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public static class NoOrdersRecordedException extends IllegalStateException {
        public NoOrdersRecordedException() {
            super("No orders have been recorded for this shop, therefore stats cannot be calculated at this moment");
        }
    }

}

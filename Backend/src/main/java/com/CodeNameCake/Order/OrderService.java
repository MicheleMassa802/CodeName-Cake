package com.CodeNameCake.Order;

import com.CodeNameCake.OrderDetailField.OrderDetailField;
import com.CodeNameCake.OrderDetailField.OrderDetailFieldRequest;
import com.CodeNameCake.OrderDetailField.OrderDetailFieldService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailFieldService orderDetailFieldService;

    @Autowired
    public OrderService(OrderRepository orderRepository, OrderDetailFieldService orderDetailFieldService) {
        this.orderRepository = orderRepository;
        this.orderDetailFieldService = orderDetailFieldService;
    }



    ////////////////////
    // PDF GET METHOD //
    ////////////////////
    public void exportPDF(HttpServletResponse response, Long orderId){
        Document document = new Document(PageSize.A4);
        // write pdf from document to the response's output stream
        try {
            PdfWriter.getInstance(document, response.getOutputStream());

            // writing on doc
            document.open();
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            titleFont.setSize(24);
            Font contentFont = FontFactory.getFont(FontFactory.HELVETICA);
            contentFont.setSize(13);

            Paragraph title = new Paragraph("<Shop Name>'s Order Receipt: " + orderId, titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);

            Paragraph content = new Paragraph("This is some content", contentFont);
            content.setAlignment(Paragraph.ALIGN_LEFT);

            // add content to doc
            document.add(title);
            document.add(content);

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

    public HashMap<String, Integer> getOrderTypeCount(Long shopId, String term) {
        String [] monthYear = term.split("-");  // results in ["month", "year"]
        List<Object[]> termOrderTypeCounts =
                orderRepository.countShopTermOrderTypes(shopId, monthYear[1], monthYear[0]);

        HashMap<String, Integer> result = new HashMap<>();

        for (Object[] keyValuePair : termOrderTypeCounts) {
            result.put((String) keyValuePair[0], (Integer) keyValuePair[1]);
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



    /////////////////
    // POST METHOD //
    /////////////////
    public void addOrder(OrderRequest order) {
        // order comes into the system as a combination of a couple entities, including the order attributes themselves,
        // and the OrderDetailField information, meaning that from this controller we perform the creation
        // of information for 2 different tables in the database which are all at heart the same entity.

        // so first I'll use the json following the format outlined on the application's notion page to create
        // the order object and save it

        Order basicOrderObject = new Order(
                order.getBasic().getShopId(), order.getBasic().getOrderName(),
                order.getBasic().getDateReceived(), order.getBasic().getDeliveryDate(),
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
                    "does not correspond to a stored order ");
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

        order1.setAttachedNextOrder(order2.getOrderId());

        // set each of order2's chain of orders to have their .attachedFrontOrder to be order1.orderId
        Long newFront = order1.getOrderId();

        List<Order> ordersToUpdateChain2 = new ArrayList<>();
        tempOrder = order2;
        tempOrder.setAttachedFrontOrder(newFront);
        ordersToUpdateChain2.add(tempOrder);

        while (tempOrder.getAttachedNextOrder() != null) {
            // fetch the next attached order and add it to the list until the order is null
            Optional<Order> middleOrder = orderRepository.findById(tempOrder.getAttachedNextOrder());

            if (middleOrder.isPresent()) {
                // get, update the front, add to list
                tempOrder = middleOrder.get();
                tempOrder.setAttachedFrontOrder(newFront);
                ordersToUpdateChain2.add(tempOrder);
            } else {
                throw new IllegalStateException("Invalid order chain");
            }
        }

        // update the DB objects if you successfully get up to this point
        orderRepository.save(order1);
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
                // update the fields of the basic order and those of the order details
                updatedOrder = originalOrder.get();
                // don't update id, or shopId, or dateReceived, or orderType, or attachedOrders
                updatedOrder.setOrderName(fullOrder.getBasic().getOrderName());
                updatedOrder.setDeliveryDate(fullOrder.getBasic().getDeliveryDate());
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

}

package com.CodeNameCake.OrdersCompleted;

import com.CodeNameCake.Order.Order;
import com.CodeNameCake.Order.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class OrdersCompletedService {

    private final OrdersCompletedRepository ordersCompletedRepository;
    private final OrderService orderService;

    @Autowired
    public OrdersCompletedService(OrdersCompletedRepository ordersCompletedRepository, OrderService orderService) {
        this.ordersCompletedRepository = ordersCompletedRepository;
        this.orderService = orderService;
    }

    ////////////////
    // GET METHOD //
    ////////////////
    public List<OrdersCompleted> getOrdersCompleted(String completedOrdersListId) {
        return ordersCompletedRepository.findOrdersCompletedByListId(completedOrdersListId);
    }

    /////////////////
    // POST METHOD //
    /////////////////
    public void registerCompletedOrders(Long shopId, List<String> termsToFill) {
        // go through the orders as pulled from the order service for each term  (from the last term registered up to
        // the latest term that just ended) and save their ids to this table completedOrdersListId = term + shopId
        // this identifier is used to search for the order completed by a shop during a term

        Date today = new Date();

        for (String term : termsToFill) {
            List<Order> shopTermOrders = orderService.getTermShopOrders(shopId, term);

            for (Order order : shopTermOrders) {
                if (today.after(order.getDeliveryDate())) {
                    String completedOrdersListId = term + order.getShopId();
                    // order is from the past, then add to completed orders
                    OrdersCompleted completed = new OrdersCompleted(order.getOrderId(), completedOrdersListId);
                    ordersCompletedRepository.save(completed);
                }
            }
        }

    }


}

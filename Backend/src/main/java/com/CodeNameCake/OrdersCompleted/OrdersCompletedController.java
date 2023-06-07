package com.CodeNameCake.OrdersCompleted;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dev/completedOrders")
public class OrdersCompletedController {
    private final OrdersCompletedService ordersCompletedService;

    @Autowired
    public OrdersCompletedController(OrdersCompletedService ordersCompletedService) {
        this.ordersCompletedService = ordersCompletedService;
    }
}

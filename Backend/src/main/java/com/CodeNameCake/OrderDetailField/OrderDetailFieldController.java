package com.CodeNameCake.OrderDetailField;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "api/dev/orderDetails")
public class OrderDetailFieldController {

    private final OrderDetailFieldService orderDetailFieldService;

    @Autowired
    public OrderDetailFieldController(OrderDetailFieldService orderDetailFieldService) {
        this.orderDetailFieldService = orderDetailFieldService;
    }

    // Post mapping for adding new details with updates
    @PostMapping
    public void addOrderDetail(@RequestBody OrderDetailField orderDetail) {
        this.orderDetailFieldService.addOrderDetail(orderDetail);
    }

    // Delete mapping for removing existing details with updates
    @DeleteMapping(path = "/{orderDetailFieldId}")
    public void deleteOrderDetailField(@PathVariable("orderDetailFieldId") Long orderDetailFieldId) {
        this.orderDetailFieldService.removeOrderDetail(orderDetailFieldId);
    }
}

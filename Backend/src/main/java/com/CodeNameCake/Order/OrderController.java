package com.CodeNameCake.Order;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping(path = "api/dev/orders")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Get mapping for the pdf receipt requests
    // (http://localhost:8080/api/dev/orders/getReceiptPdf/#)
    @GetMapping(path = "/getReceiptPdf/{orderId}")
    public void getReceiptPdf(@PathVariable("orderId") Long orderId, HttpServletResponse response) {
        response.setContentType("application/pdf");

        // get datetime to identify pdf doc
        DateFormat dateFormatter = new SimpleDateFormat("yyy-MM-dd:hh:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());

        String headerKey = "Content-Disposition";
        String headerValue = "inline; filename=<ShopName>_pdf_receipt_" + currentDateTime + ".pdf";

        response.setHeader(headerKey, headerValue);

        orderService.exportPDF(response, orderId);
    }

    @GetMapping(path = "/getShopOrders/{shopId}")
    public List<List<OrderResponse>> getShopOrders(@PathVariable("shopId") Long shopId) {
        return orderService.getShopOrders(shopId, null);
    }

    @GetMapping(path = "/getRelevantShopOrders/{shopId}")
    public List<List<OrderResponse>> getRelevantShopOrders(@PathVariable("shopId") Long shopId) {
        return orderService.getRelevantShopOrders(shopId);
    }

    @GetMapping(path = "/getShopTermOrders/{shopId}/{term}")
    public List<List<OrderResponse>> getShopTermOrders(@PathVariable("shopId") Long shopId,
            @PathVariable("term") String term) {
        return orderService.getShopOrders(shopId, term);
    }

    @GetMapping(path = "/getOrderById/{orderId}")
    public List<OrderResponse> getOrder(@PathVariable("orderId") Long orderId) {
        return orderService.getSpecificOrder(orderId);
    }

    @PostMapping
    public void addOrder(@RequestBody OrderRequest order) {
        orderService.addOrder(order);
    }

    @PostMapping(path = "/merge/{orderId1}/{orderId2}")
    public void mergeOrders(@PathVariable("orderId1") Long orderId1,
            @PathVariable("orderId2") Long orderId2) {
        orderService.mergeOrders(orderId1, orderId2);
    }

    @DeleteMapping(path = "/delete/{orderId}")
    public void deleteOrder(@PathVariable("orderId") Long orderId) {
        orderService.deleteOrder(orderId);
    }

    @PutMapping(path = "/update")
    public void updateOrder(@RequestBody List<OrderResponse> orderUpdater) {
        // order input given as a list of orderResponses as you first get the
        // non-updated into the FE and once the user
        // modifies that response list, it gets sent back

        // orderUpdater already comes with its corresponding orderIds to get the
        // original objects
        orderService.updateOrder(orderUpdater);
    }

}

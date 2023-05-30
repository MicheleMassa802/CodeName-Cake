package com.CodeNameCake.Order;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
@RequestMapping(path = "api/dev/orders")
public class OrderController {

    private final OrderService orderService;

    @Autowired

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Get mapping for the pdf receipt requests (http://localhost:8080/api/dev/orders/getReceiptPdf/#)
    @GetMapping(path = "/getReceiptPdf/{orderId}")
    public void getReceiptPdf(@PathVariable("orderId") Long orderId, HttpServletResponse response) {
        response.setContentType("application/pdf");
        System.out.println("Printing pdf for order " + orderId);

        // get datetime to identify pdf doc
        DateFormat dateFormatter = new SimpleDateFormat("yyy-MM-dd:hh:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());

        String headerKey = "Content-Disposition";
        String headerValue = "inline; filename=<ShopName>_pdf_receipt_" + currentDateTime + ".pdf";

        response.setHeader(headerKey, headerValue);

        orderService.exportPDF(response, orderId);
    }

}

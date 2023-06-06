package com.CodeNameCake.Order;

import com.CodeNameCake.OrderDetailField.OrderDetailFieldRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
    private Order basic;
    private List<OrderDetailFieldRequest> orderDetails;
}

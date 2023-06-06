package com.CodeNameCake.Order;

import com.CodeNameCake.OrderDetailField.OrderDetailField;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {

    private Order basic;
    private List<OrderDetailField> orderDetails;
}

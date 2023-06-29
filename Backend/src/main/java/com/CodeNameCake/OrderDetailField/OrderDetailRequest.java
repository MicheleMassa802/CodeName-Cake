package com.CodeNameCake.OrderDetailField;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailRequest {

    // the 3 details in a request body needed to create an orderDetail
    private Long orderId;
    // no need to check for its existence as you can only create an order details after pulling its order
    private String fieldName;  // contains a '--' separating the group name and property
    private String fieldValue;
}

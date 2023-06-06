package com.CodeNameCake.OrderDetailField;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailFieldRequest {
    private String fieldName;
    private String fieldValue;
}

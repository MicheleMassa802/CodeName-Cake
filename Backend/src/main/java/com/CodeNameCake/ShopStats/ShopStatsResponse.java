package com.CodeNameCake.ShopStats;

import com.CodeNameCake.OrdersCompleted.OrdersCompleted;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShopStatsResponse {
    private ShopStats basic;
    private List<OrdersCompleted> ordersCompleted;
    private int ordersCompletedLength;
}

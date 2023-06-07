package com.CodeNameCake.OrdersCompleted;

import jakarta.persistence.*;

@Entity
@Table(name = "OrdersCompleted")
public class OrdersCompleted {

    @Id
    @SequenceGenerator(
            name="orders_completed_sequence",
            sequenceName="orders_completed_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "orders_completed_sequence"
    )
    private Long ordersCompletedId;
    @Basic(optional = false)
    private Long orderId;  // foreign key to Orders table
    @Basic(optional = false)
    private String completedOrdersListId;

    public OrdersCompleted(){}

    public OrdersCompleted(Long ordersCompletedId, Long orderId, String completedOrdersListId) {
        this.ordersCompletedId = ordersCompletedId;
        this.orderId = orderId;
        this.completedOrdersListId = completedOrdersListId;
    }

    public OrdersCompleted(Long orderId, String completedOrdersListId) {
        this.orderId = orderId;
        this.completedOrdersListId = completedOrdersListId;
    }

    public Long getOrdersCompletedId() {
        return ordersCompletedId;
    }

    public void setOrdersCompletedId(Long ordersCompletedId) {
        this.ordersCompletedId = ordersCompletedId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getCompletedOrdersListId() {
        return completedOrdersListId;
    }

    public void setCompletedOrdersListId(String completedOrdersListId) {
        this.completedOrdersListId = completedOrdersListId;
    }

    @Override
    public String toString() {
        return "OrdersCompleted{" +
                "ordersCompletedId=" + ordersCompletedId +
                ", orderId=" + orderId +
                ", completedOrdersListId=" + completedOrdersListId +
                '}';
    }
}

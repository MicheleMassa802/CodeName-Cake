package com.CodeNameCake.OrderDetails;

import jakarta.persistence.*;

@Entity
@Table(name = "OrderDetails")
public class OrderDetails {

    @Id
    @SequenceGenerator(
            name="order_details_sequence",
            sequenceName="order_details_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "order_details_sequence"
    )
    private Long orderDetailId;
    @Basic(optional = false)
    private Long orderId;  // foreign key to Orders table

    public OrderDetails(){}

    public OrderDetails(Long orderDetailId, Long orderId) {
        this.orderDetailId = orderDetailId;
        this.orderId = orderId;
    }

    public OrderDetails(Long orderId) {
        this.orderId = orderId;
    }

    public Long getOrderDetailId() {
        return orderDetailId;
    }

    public void setOrderDetailId(Long orderDetailId) {
        this.orderDetailId = orderDetailId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    @Override
    public String toString() {
        return "OrderDetails{" +
                "orderDetailId=" + orderDetailId +
                ", orderId=" + orderId +
                '}';
    }
}

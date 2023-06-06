package com.CodeNameCake.OrderDetailField;

import jakarta.persistence.*;

@Entity
@Table(name = "OrderDetailFields")
public class OrderDetailField {

    @Id
    @SequenceGenerator(
            name="order_detail_field_sequence",
            sequenceName="order_detail_field_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "order_detail_field_sequence"
    )
    private Long orderDetailFieldId;
    @Basic(optional = false)
    private Long orderId;  // foreign key to Order table
    private String fieldName;
    private String fieldValue;

    public OrderDetailField(){}

    public OrderDetailField(Long orderDetailFieldId, Long orderId, String fieldName, String fieldValue) {
        this.orderDetailFieldId = orderDetailFieldId;
        this.orderId = orderId;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

    public OrderDetailField(Long orderId, String fieldName, String fieldValue) {
        this.orderId = orderId;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

    public Long getOrderDetailFieldId() {
        return orderDetailFieldId;
    }

    public void setOrderDetailFieldId(Long orderDetailFieldId) {
        this.orderDetailFieldId = orderDetailFieldId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getFieldValue() {
        return fieldValue;
    }

    public void setFieldValue(String fieldValue) {
        this.fieldValue = fieldValue;
    }

    @Override
    public String toString() {
        return "OrderDetailField{" +
                "orderDetailFieldId=" + orderDetailFieldId +
                ", orderDetailId=" + orderId +
                ", fieldName='" + fieldName + '\'' +
                ", fieldValue='" + fieldValue + '\'' +
                '}';
    }
}

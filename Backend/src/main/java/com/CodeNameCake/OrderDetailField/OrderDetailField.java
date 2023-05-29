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
    private Long orderDetailId;  // foreign key to OrderDetails table
    private String fieldName;
    private String fieldValue;

    public OrderDetailField(){}

    public OrderDetailField(Long orderDetailFieldId, Long orderDetailId, String fieldName, String fieldValue) {
        this.orderDetailFieldId = orderDetailFieldId;
        this.orderDetailId = orderDetailId;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

    public OrderDetailField(Long orderDetailId, String fieldName, String fieldValue) {
        this.orderDetailId = orderDetailId;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

    public Long getOrderDetailFieldId() {
        return orderDetailFieldId;
    }

    public void setOrderDetailFieldId(Long orderDetailFieldId) {
        this.orderDetailFieldId = orderDetailFieldId;
    }

    public Long getOrderDetailId() {
        return orderDetailId;
    }

    public void setOrderDetailId(Long orderDetailId) {
        this.orderDetailId = orderDetailId;
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
                ", orderDetailId=" + orderDetailId +
                ", fieldName='" + fieldName + '\'' +
                ", fieldValue='" + fieldValue + '\'' +
                '}';
    }
}

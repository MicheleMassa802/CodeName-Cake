package com.CodeNameCake.Order;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name="Orders")
public class Order {

    @Id
    @SequenceGenerator(
            name="order_sequence",
            sequenceName="order_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "order_sequence"
    )
    private Long orderId;
    @Basic(optional = false)
    private Long shopId;  // foreign key to Shops table
    private String orderName;
    @Temporal(TemporalType.DATE)
    private Date dateReceived;
    @Temporal(TemporalType.DATE)
    private Date deliveryDate;
    private String clientContact; // Instagram @
    @Column(length = 500)
    private String extraNotes;
    private Integer estimatedCost;
    private String orderType;  // one of "Cake", "Cookies", "Cupcakes", "Other"
    @Basic(optional = true)
    private Long attachedFrontOrder;  // key into another Orders table row
    @Basic(optional = true)
    private Long attachedNextOrder;  // key into another Orders table row

    public Order(){}

    public Order(Long orderId, Long shopId, String orderName, Date dateReceived, Date deliveryDate,
                 String clientContact, String extraNotes, Integer estimatedCost, String orderType,
                 Long attachedFrontOrder, Long attachedNextOrder) {
        this.orderId = orderId;
        this.shopId = shopId;
        this.orderName = orderName;
        this.dateReceived = dateReceived;
        this.deliveryDate = deliveryDate;
        this.clientContact = clientContact;
        this.extraNotes = extraNotes;
        this.estimatedCost = estimatedCost;
        this.orderType = orderType;
        this.attachedFrontOrder = attachedFrontOrder;
        this.attachedNextOrder = attachedNextOrder;
    }

    public Order(Long shopId, String orderName, Date dateReceived, Date deliveryDate, String clientContact,
                 String extraNotes, Integer estimatedCost, String orderType, Long attachedFrontOrder,
                 Long attachedNextOrder) {
        this.shopId = shopId;
        this.orderName = orderName;
        this.dateReceived = dateReceived;
        this.deliveryDate = deliveryDate;
        this.clientContact = clientContact;
        this.extraNotes = extraNotes;
        this.estimatedCost = estimatedCost;
        this.orderType = orderType;
        this.attachedFrontOrder = attachedFrontOrder;
        this.attachedNextOrder = attachedNextOrder;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    public String getOrderName() {
        return orderName;
    }

    public void setOrderName(String orderName) {
        this.orderName = orderName;
    }

    public Date getDateReceived() {
        return dateReceived;
    }

    public void setDateReceived(Date dateReceived) {
        this.dateReceived = dateReceived;
    }

    public Date getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(Date deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public String getClientContact() {
        return clientContact;
    }

    public void setClientContact(String clientContact) {
        this.clientContact = clientContact;
    }

    public String getExtraNotes() {
        return extraNotes;
    }

    public void setExtraNotes(String extraNotes) {
        this.extraNotes = extraNotes;
    }

    public Integer getEstimatedCost() {
        return estimatedCost;
    }

    public void setEstimatedCost(Integer estimatedCost) {
        this.estimatedCost = estimatedCost;
    }

    public String getOrderType() {
        return orderType;
    }

    public void setOrderType(String orderType) {
        this.orderType = orderType;
    }

    public Long getAttachedFrontOrder() {
        return attachedFrontOrder;
    }

    public void setAttachedFrontOrder(Long attachedFrontOrder) {
        this.attachedFrontOrder = attachedFrontOrder;
    }

    public Long getAttachedNextOrder() {
        return attachedNextOrder;
    }

    public void setAttachedNextOrder(Long attachedNextOrder) {
        this.attachedNextOrder = attachedNextOrder;
    }

    @Override
    public String toString() {
        return "Order{" +
                "orderId=" + orderId +
                ", shopId=" + shopId +
                ", orderName='" + orderName + '\'' +
                ", dateReceived=" + dateReceived +
                ", deliveryDate=" + deliveryDate +
                ", clientContact='" + clientContact + '\'' +
                ", extraNotes='" + extraNotes + '\'' +
                ", estimatedCost=" + estimatedCost +
                ", orderType='" + orderType + '\'' +
                ", attachedPrevOrder=" + attachedFrontOrder +
                ", attachedNextOrder=" + attachedNextOrder +
                '}';
    }
}

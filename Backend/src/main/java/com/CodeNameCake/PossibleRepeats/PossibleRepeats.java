package com.CodeNameCake.PossibleRepeats;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "PossibleRepeats")
public class PossibleRepeats {

    @Id
    @SequenceGenerator(
            name="possible_repeats_sequence",
            sequenceName="possible_repeats_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "possible_repeats_sequence"
    )
    private Long possibleRepeatsId;
    @Basic(optional = false)
    private Long shopStatsId;  // foreign key to ShopStats table
    private String orderName;
    @Temporal(TemporalType.DATE)
    private Date expectedDeliveryDate;
    private Integer expectedOrderCost;

    public PossibleRepeats(){}

    public PossibleRepeats(Long possibleRepeatsId, Long shopStatsId, String orderName, Date expectedDeliveryDate,
                           Integer expectedOrderCost) {
        this.possibleRepeatsId = possibleRepeatsId;
        this.shopStatsId = shopStatsId;
        this.orderName = orderName;
        this.expectedDeliveryDate = expectedDeliveryDate;
        this.expectedOrderCost = expectedOrderCost;
    }

    public PossibleRepeats(Long shopStatsId, String orderName, Date expectedDeliveryDate, Integer expectedOrderCost) {
        this.shopStatsId = shopStatsId;
        this.orderName = orderName;
        this.expectedDeliveryDate = expectedDeliveryDate;
        this.expectedOrderCost = expectedOrderCost;
    }

    public Long getPossibleRepeatsId() {
        return possibleRepeatsId;
    }

    public void setPossibleRepeatsId(Long possibleRepeatsId) {
        this.possibleRepeatsId = possibleRepeatsId;
    }

    public Long getShopStatsId() {
        return shopStatsId;
    }

    public void setShopStatsId(Long shopStatsId) {
        this.shopStatsId = shopStatsId;
    }

    public String getOrderName() {
        return orderName;
    }

    public void setOrderName(String orderName) {
        this.orderName = orderName;
    }

    public Date getExpectedDeliveryDate() {
        return expectedDeliveryDate;
    }

    public void setExpectedDeliveryDate(Date expectedDeliveryDate) {
        this.expectedDeliveryDate = expectedDeliveryDate;
    }

    public Integer getExpectedOrderCost() {
        return expectedOrderCost;
    }

    public void setExpectedOrderCost(Integer expectedOrderCost) {
        this.expectedOrderCost = expectedOrderCost;
    }

    @Override
    public String toString() {
        return "PossibleRepeats{" +
                "possibleRepeatsId=" + possibleRepeatsId +
                ", shopStatsId=" + shopStatsId +
                ", orderName='" + orderName + '\'' +
                ", expectedDeliveryDate=" + expectedDeliveryDate +
                ", expectedOrderCost=" + expectedOrderCost +
                '}';
    }
}

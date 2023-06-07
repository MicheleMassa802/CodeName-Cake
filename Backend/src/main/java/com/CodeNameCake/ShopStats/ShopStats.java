package com.CodeNameCake.ShopStats;

import jakarta.persistence.*;

@Entity
@Table(name = "ShopStats")
public class ShopStats {

    @Id
    @SequenceGenerator(
            name="shopStats_sequence",
            sequenceName="shopStats_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "shopStats_sequence"
    )
    private Long shopStatsId;
    @Basic(optional = false)
    private Long shopId;  // foreign key to Shops table
    @Basic(optional = false)
    private String completedOrdersListId;  // foreign key to OrdersCompleted table
    private String term;  // hard coded in format "MM-YYYY"
    private String popularOrderType;  // one of "Cake", "Cookies", "Cupcakes", "Other"
    private Integer biggestOrder;
    private Integer totalOrderIncome;
    private Double businessLevel;  // number where 100 is average


    public ShopStats(){}

    public ShopStats(Long shopStatsId, Long shopId, String completedOrdersListId, String term, String popularOrderType,
                     Integer biggestOrder, Integer totalOrderIncome, Double businessLevel) {
        this.shopStatsId = shopStatsId;
        this.shopId = shopId;
        this.completedOrdersListId = completedOrdersListId;
        this.term = term;
        this.popularOrderType = popularOrderType;
        this.biggestOrder = biggestOrder;
        this.totalOrderIncome = totalOrderIncome;
        this.businessLevel = businessLevel;
    }

    public ShopStats(Long shopId, String completedOrdersListId, String term, String popularOrderType, Integer biggestOrder,
                     Integer totalOrderIncome, Double businessLevel) {
        this.shopId = shopId;
        this.completedOrdersListId = completedOrdersListId;
        this.term = term;
        this.popularOrderType = popularOrderType;
        this.biggestOrder = biggestOrder;
        this.totalOrderIncome = totalOrderIncome;
        this.businessLevel = businessLevel;
    }

    public Long getShopStatsId() {
        return shopStatsId;
    }

    public void setShopStatsId(Long shopStatsId) {
        this.shopStatsId = shopStatsId;
    }

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    public String getCompletedOrdersListId() {
        return completedOrdersListId;
    }

    public void setCompletedOrdersListId(String completedOrdersListId) {
        this.completedOrdersListId = completedOrdersListId;
    }

    public String getTerm() {
        return term;
    }

    public void setTerm(String term) {
        this.term = term;
    }

    public String getPopularOrderType() {
        return popularOrderType;
    }

    public void setPopularOrderType(String popularOrderType) {
        this.popularOrderType = popularOrderType;
    }

    public Integer getBiggestOrder() {
        return biggestOrder;
    }

    public void setBiggestOrder(Integer biggestOrder) {
        this.biggestOrder = biggestOrder;
    }

    public Integer getTotalOrderIncome() {
        return totalOrderIncome;
    }

    public void setTotalOrderIncome(Integer totalOrderIncome) {
        this.totalOrderIncome = totalOrderIncome;
    }

    public Double getBusinessLevel() {
        return businessLevel;
    }

    public void setBusinessLevel(Double businessLevel) {
        this.businessLevel = businessLevel;
    }

    @Override
    public String toString() {
        return "ShopStats{" +
                "shopStatsId=" + shopStatsId +
                ", shopId=" + shopId +
                ", ordersCompletedId=" + completedOrdersListId +
                ", term='" + term + '\'' +
                ", popularOrderType='" + popularOrderType + '\'' +
                ", biggestOrder=" + biggestOrder +
                ", totalOrderIncome=" + totalOrderIncome +
                ", businessLevel=" + businessLevel +
                '}';
    }
}

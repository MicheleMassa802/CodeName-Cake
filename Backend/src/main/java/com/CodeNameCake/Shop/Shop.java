package com.CodeNameCake.Shop;

import jakarta.persistence.*;

@Entity
@Table(name = "Shop")
public class Shop {

    @Id
    @SequenceGenerator(
            name="shop_sequence",
            sequenceName="shop_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "shop_sequence"
    )
    private Long shopId;
    private String shopName;
    private Integer colorwaySelection;  // from 0 to 4 to define the selected colorway option


    public Shop() {}

    public Shop(Long shopId, String shopName, Integer colorwaySelection) {
        this.shopId = shopId;
        this.shopName = shopName;
        this.colorwaySelection = colorwaySelection;
    }

    public Shop(String shopName, Integer colorwaySelection) {
        this.shopName = shopName;
        this.colorwaySelection = colorwaySelection;
    }

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public Integer getColorwaySelection() {
        return colorwaySelection;
    }

    public void setColorwaySelection(Integer colorwaySelection) {
        this.colorwaySelection = colorwaySelection;
    }

    @Override
    public String toString() {
        return "Shop{" +
                "shopId=" + shopId +
                ", shopName='" + shopName + '\'' +
                ", colorwaySelection=" + colorwaySelection +
                '}';
    }
}

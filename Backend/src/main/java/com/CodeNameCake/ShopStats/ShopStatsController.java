package com.CodeNameCake.ShopStats;

import com.CodeNameCake.Shop.Shop;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dev/shopStats")
public class ShopStatsController {

    private final ShopStatsService shopStatsService;

    @Autowired
    public ShopStatsController(ShopStatsService shopStatsService) {
        this.shopStatsService = shopStatsService;
    }

    @GetMapping(path = "/{shopId}/{term}")
    public ShopStatsResponse getShopTermStats(@PathVariable("shopId") Long shopId,
            @PathVariable("term") String term) {
        return shopStatsService.getShopTermStats(shopId, term);
    }

    @DeleteMapping("/{shopId}")
    public void deleteAllShopStats(@PathVariable("shopId") Long shopId) {
        shopStatsService.deleteAllShopStats(shopId);
    }

    @PostMapping(path = "/configureShopStats/{userId}")
    public Integer configureShopStats(@PathVariable("userId") Long userId) {
        return shopStatsService.configureShopStats(userId);
    }

}

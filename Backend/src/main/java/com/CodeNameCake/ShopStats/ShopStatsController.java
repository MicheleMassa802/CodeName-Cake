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

    @GetMapping
    public List<ShopStats> getShopStats(){
        return shopStatsService.getShopStats();
    }

    @GetMapping(path= "/getShopTermStats/{shopId}/{term}")
    public ShopStats getShopTermStats(@PathVariable("shopId") Long shopId,
                                 @PathVariable("term") String term) {
        return shopStatsService.getShopTermStats(shopId, term);
    }

    @PostMapping
    public void addShopStats(@RequestBody ShopStats shopStats) {
        shopStatsService.addShopStats(shopStats);
    }

    @DeleteMapping("/{shopId}")
    public void deleteAllShopStats(@PathVariable("shopId") Long shopId){
        shopStatsService.deleteAllShopStats(shopId);
    }

    @GetMapping(path = "/configureShopStats/{userId}")
    public Integer configureShopStats(@PathVariable("userId") Long userId) {
        return shopStatsService.configureShopStats(userId);
    }





}

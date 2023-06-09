package com.CodeNameCake.Shop;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/dev/shop")
public class ShopController {

    private final ShopService shopService;

    @Autowired
    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @GetMapping
    public List<Shop> getShops() { return this.shopService.getShops(); }

    @GetMapping(path= "/getShop/{shopId}")
    public Shop getShop(@PathVariable("shopId") Long shopId) { return shopService.getShop(shopId); }

    @PostMapping(path= "/addShop")  // for whitelisting purposes
    public Long addShop(@RequestBody Shop shop) {
        Long shopId = shopService.addShop(shop);
        return shopId;
    }

    @DeleteMapping(path = "/{shopId}")
    public void deleteShop(@PathVariable("shopId") Long shopId){
        shopService.deleteShop(shopId);
    }

    @PutMapping(path = "/{shopId}")
    public void updateShop(@PathVariable("shopId") Long shopId, @RequestBody Shop shopUpdater) {
        shopService.updateShop(shopId, shopUpdater);
    }

}

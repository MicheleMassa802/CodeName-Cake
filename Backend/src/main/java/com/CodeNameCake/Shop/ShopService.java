package com.CodeNameCake.Shop;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShopService {

    private final ShopRepository shopRepository;

    @Autowired
    public ShopService(ShopRepository shopRepository) {
        this.shopRepository = shopRepository;
    }

    ////////////////
    // GET METHOD //
    ////////////////
    public List<Shop> getShops() {
        return shopRepository.findAll();
    }



    public Shop getShop(Long shopId) {
        Optional<Shop> shop = shopRepository.findById(shopId);

        if (shop.isPresent()) {
            return shop.get();
        } else {
            throw new IllegalStateException("Shop with ID " + shopId + " does not exist");
        }
    }

    public boolean shopExists(Long shopId) {
        return shopRepository.existsById(shopId);
    }


    /////////////////
    // POST METHOD //
    /////////////////
    public Long addShop(Shop shop) {
        // returns its ID that is to be sent with the user creation request
        shopRepository.save(shop);  // no repeats to take care of

        // get the id of the shop you just created
        return shop.getShopId();
    }


    ///////////////////
    // DELETE METHOD //
    ///////////////////
    public void deleteShop(Long shopId) {
        boolean validShop = shopRepository.existsById(shopId);

        if (validShop) {
            shopRepository.deleteById(shopId);
        } else {
            throw new IllegalStateException("Shop with ID " + shopId + " does not exist");
        }
    }


    ////////////////
    // PUT METHOD //
    ////////////////
    public void updateShop(Long shopId, Shop shopUpdater) {
        Optional<Shop> shopToUpdate = shopRepository.findById(shopId);

        Shop updatedShop;

        if (shopToUpdate.isPresent()) {
            updatedShop = shopToUpdate.get();
            updatedShop.setShopName(shopUpdater.getShopName());
            updatedShop.setColorwaySelection(shopUpdater.getColorwaySelection());

            shopRepository.save(updatedShop);
        } else {

            throw new IllegalStateException("Shop with ID " + shopId + " does not exist");
        }
    }
}

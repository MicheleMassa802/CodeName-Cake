package com.CodeNameCake.Order;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // getting orders by shopId
    @Query("SELECT o FROM Order  o WHERE o.shopId = ?1")
    List<Order> getOrdersByShopId(Long shopId);

    // getting orders by shopId for a specific term
    @Query("SELECT o FROM Order o WHERE o.shopId = ?1 AND FUNCTION('YEAR', o.deliveryDate) = ?2 " +
            "AND FUNCTION('MONTH', o.deliveryDate) = ?3")
    List<Order> getTermOrdersByShopId(Long shopId, String year, String month);


}

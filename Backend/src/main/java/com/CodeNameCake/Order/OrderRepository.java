package com.CodeNameCake.Order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // getting orders by shopId
    @Query("SELECT o FROM Order o WHERE o.shopId = ?1 ORDER BY o.deliveryDate DESC")
    List<Order> getOrdersByShopId(Long shopId);

    // getting orders by shopId for a specific term
    @Query("SELECT o FROM Order o WHERE o.shopId = ?1 AND EXTRACT(YEAR FROM o.deliveryDate) = ?2 " +
            "AND EXTRACT(MONTH FROM o.deliveryDate) = ?3")
    List<Order> getTermOrdersByShopId(Long shopId, String year, String month);

    // getting count of orderTypes for orders by shopId for a specific term
    @Query("SELECT o.orderType, count(o) FROM Order o WHERE o.shopId = ?1 AND EXTRACT(YEAR FROM o.deliveryDate) = ?2 " +
            "AND EXTRACT(MONTH FROM o.deliveryDate) = ?3 GROUP BY o.orderType")
    List<Object[]> countShopTermOrderTypes(Long shopId, String year, String month);

    // getting max estimated cost order by shopId for a specific term
    @Query("SELECT max(o.estimatedCost) FROM Order o WHERE o.shopId = ?1 AND EXTRACT(YEAR FROM o.deliveryDate) = ?2 " +
            "AND EXTRACT(MONTH FROM o.deliveryDate) = ?3")
    Integer getShopTermMaxCostOrder(Long shopId, String year, String month);

    // getting sum of order estimated costs by shopId for a specific term
    @Query("SELECT sum(o.estimatedCost) FROM Order o WHERE o.shopId = ?1 AND EXTRACT(YEAR FROM o.deliveryDate) = ?2 " +
            "AND EXTRACT(MONTH FROM o.deliveryDate) = ?3")
    Integer getShopTermIncome(Long shopId, String year, String month);

    // get the earliest to latest terms in the Order table for the given shopId
    @Query("SELECT MIN(o.deliveryDate) FROM Order o WHERE o.shopId = ?1")
    Optional<Date> getEarliestOrderTerm(Long shopId);




}

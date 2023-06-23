package com.CodeNameCake.ShopStats;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopStatsRepository extends JpaRepository<ShopStats, Long> {

    // ordering shopStats by term so that the first result in the list is the latest term recorded
    @Query("SELECT s FROM ShopStats s WHERE s.shopId = ?1 ORDER BY to_date(s.term, 'MM-YYYY') DESC")
    List<ShopStats> orderShopStatsByTerm(Long shopId);

    // grouping term and averaging totalOrderIncome
    @Query("SELECT sum(s.totalOrderIncome), s.term FROM ShopStats s WHERE s.shopId = ?1 GROUP BY s.term")
    List<Object[]> getShopTermTotalIncome(Long shopId);

    // getting a single stats row for the specified shop id and term provided
    @Query("SELECT s FROM ShopStats s WHERE s.shopId = ?1 AND s.term = ?2")
    Optional<ShopStats> findShopStatsByShopAndTerm(Long shopId, String term);

    // getting all rows where the shopId given matches
    @Query("SELECT s FROM ShopStats s WHERE s.shopId = ?1")
    List<ShopStats> findShopStatsByShopId(Long shopId);

}

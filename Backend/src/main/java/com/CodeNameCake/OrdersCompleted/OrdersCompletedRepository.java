package com.CodeNameCake.OrdersCompleted;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdersCompletedRepository extends JpaRepository<OrdersCompleted, Long> {

    // returning all rows associated to the given completedOrdersListId give
    @Query("SELECT oc FROM OrdersCompleted oc WHERE oc.completedOrdersListId = ?1")
    List<OrdersCompleted> findOrdersCompletedByListId(String completedOrdersListId);

}

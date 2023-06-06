package com.CodeNameCake.OrderDetailField;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailFieldRepository extends JpaRepository<OrderDetailField, Long> {

    @Query("SELECT od FROM OrderDetailField od WHERE od.orderId = ?1")
    List<OrderDetailField> getOrderDetailsByOrderId(Long orderId);
}

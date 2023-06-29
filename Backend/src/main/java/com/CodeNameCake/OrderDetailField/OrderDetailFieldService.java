package com.CodeNameCake.OrderDetailField;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderDetailFieldService {

    private final OrderDetailFieldRepository orderDetailFieldRepository;

    @Autowired
    public OrderDetailFieldService(OrderDetailFieldRepository orderDetailFieldRepository) {
        this.orderDetailFieldRepository = orderDetailFieldRepository;
    }

    public List<OrderDetailField> getOrderDetails(Long orderId) {
        // retrieve the order details corresponding to an order
        return orderDetailFieldRepository.getOrderDetailsByOrderId(orderId);
    }

    public void addOrderDetail(OrderDetailField orderDetail) {
        // save the object as is, no need to check for repeats
        orderDetailFieldRepository.save(orderDetail);
    }

    public void removeOrderDetail(Long orderDetailFieldId) {
        // get the orderDetailField entity
        Optional<OrderDetailField> orderDetailField = orderDetailFieldRepository.findById(orderDetailFieldId);

        if (orderDetailField.isPresent()) {
            orderDetailFieldRepository.delete(orderDetailField.get());
        } else {
            throw new IllegalStateException("Order Detail with ID " + orderDetailFieldId
                    + " does not exist");
        }


    }

    public void deleteOrderDetail(Long orderId) {
        List<OrderDetailField> orderDetails = orderDetailFieldRepository.getOrderDetailsByOrderId(orderId);
        // delete all the retrieved objects
        orderDetailFieldRepository.deleteAll(orderDetails);
    }

    public void updateOrderDetail(OrderDetailField orderDetailUpdater) {
        // fetch original order detail, update its fields and save the changes
        Optional<OrderDetailField> originalOrderDetail =
                orderDetailFieldRepository.findById(orderDetailUpdater.getOrderDetailFieldId());

        OrderDetailField updatedOrderDetail;

        if (originalOrderDetail.isPresent()) {
            // update its fields with the given orderDetailUpdater
            updatedOrderDetail = originalOrderDetail.get();
            // we don't update the id nor the corresponding orderId
            updatedOrderDetail.setFieldName(orderDetailUpdater.getFieldName());
            updatedOrderDetail.setFieldValue(orderDetailUpdater.getFieldValue());

            orderDetailFieldRepository.save(updatedOrderDetail);
        } else {
            throw new IllegalStateException("Order Detail with ID " + orderDetailUpdater.getOrderId()
                    + " does not exist");
        }
    }
}

package com.eventaura.backend.repository;

import com.eventaura.backend.entity.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository

import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> getOrdersByUserId(String userId);
}
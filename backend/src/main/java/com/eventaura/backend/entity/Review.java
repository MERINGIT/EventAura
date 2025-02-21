/**
 * Author: Sruthi Shaji
 */
package com.eventaura.backend.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "reviews")
public class Review {

    @Id
    private String id;
    private Float rating;
    private String comment;

    private String userId;
    private String eventId;
    private String addedAt;
}

/**
 * Authors : Nikita Davies, Sruthi Shaji, Kabilesh Ravi Chandran
 */

package com.eventaura.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "events")
public class Event {

    @Id
    private String id;

    private String date;
    private String startTime;
    private String endTime;
    private String title;
    private String description;
    private Float price;
    private String location;
    private String organizerId;
    private String eventType;
    private String locationType;
    private Boolean isApproved;
    private String comment;
    private List<String> images;

    public Boolean getApproved() {
        return isApproved;
    }

    public void setApproved(Boolean approved) {
        isApproved = approved;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(String organizerId) {
        this.organizerId = organizerId;
    }

    @JsonIgnore
    private List<Review> reviews = new ArrayList<Review>();

}

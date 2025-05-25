package com.andy.iot.response;

import com.andy.iot.model.Notification;
import lombok.Data;

import java.util.List;

@Data
public class NotificationResponse {
    private List<Notification> notificationList;
    //Pagination information
    private Integer currentPage;
    private Integer totalPages;
    private Long totalElements;
}

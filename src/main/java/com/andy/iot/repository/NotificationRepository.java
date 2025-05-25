package com.andy.iot.repository;

import com.andy.iot.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    @Query("SELECT n FROM Notification n ORDER BY n.time DESC")
    Page<Notification> findAllNotificationsSortedByTimeDesc(Pageable pageable);
}

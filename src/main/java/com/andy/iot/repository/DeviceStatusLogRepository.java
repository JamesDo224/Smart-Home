package com.andy.iot.repository;

import com.andy.iot.model.DeviceStatusLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DeviceStatusLogRepository extends JpaRepository<DeviceStatusLog, Integer> {
    @Query("""
        SELECT d FROM DeviceStatusLog d 
        WHERE d.device.id = :deviceId 
          AND d.source = 'USER' 
          AND d.createdAt > :threshold
        ORDER BY d.createdAt DESC
    """)
    List<DeviceStatusLog> findRecentUserActions(@Param("deviceId") Integer deviceId,
                                               @Param("threshold") LocalDateTime threshold);
}

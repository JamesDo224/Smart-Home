package com.andy.iot.repository;

import com.andy.iot.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
    @Query(value = """
        SELECT * FROM schedule s 
        WHERE (CASE :day 
                WHEN 'monday' THEN s.mon 
                WHEN 'tuesday' THEN s.tue 
                WHEN 'wednesday' THEN s.wed 
                WHEN 'thursday' THEN s.thu 
                WHEN 'friday' THEN s.fri 
                WHEN 'saturday' THEN s.sat 
                WHEN 'sunday' THEN s.sun 
               END) = true
          AND s.from_time <= :now 
          AND :now <= (s.to_time + INTERVAL '1 minute')
        """, nativeQuery = true)
    List<Schedule> findActiveSchedules(@Param("day") String day, @Param("now") LocalTime now);

    List<Schedule> findByDeviceId(Integer deviceId);
}

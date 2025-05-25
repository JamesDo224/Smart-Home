package com.andy.iot.repository;

import com.andy.iot.dto.SensorRecordAvgDTO;
import com.andy.iot.model.SensorRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SensorRecordRepository extends JpaRepository<SensorRecord, Integer> {
//    @Query(value = "SELECT new com.andy.iot.dto.SensorRecordAvgDTO(" +
//            "  AVG(CASE WHEN sensor_id = 1 THEN CAST(record_value AS double precision) END), " + // Temperature
//            "  AVG(CASE WHEN sensor_id = 2 THEN CAST(record_value AS double precision) END), " + // Humidity
//            "  AVG(CASE WHEN sensor_id = 3 THEN CAST(record_value AS double precision) END), " + // Light
//            "  AVG(CASE WHEN sensor_id = 4 THEN CAST(record_value AS double precision) END), " + // AirQuality
//            "  DATE(record_time)) " +
//            "FROM record " +
//            "WHERE record_time BETWEEN :startDate AND :endDate " +
//            "GROUP BY DATE(record_time) " +
//            "ORDER BY DATE(record_time)", nativeQuery = true)
//    List<SensorRecordAvgDTO> findWeeklyAverage(
//            @Param("startDate") LocalDateTime startDate,
//            @Param("endDate") LocalDateTime endDate);

    @Query(value = """
    SELECT 
        COALESCE(AVG(CASE WHEN sensor_id = 1 THEN CAST(record_value AS double precision) END), 0) AS temperature_avg,
        COALESCE(AVG(CASE WHEN sensor_id = 2 THEN CAST(record_value AS double precision) END), 0) AS humidity_avg,
        COALESCE(AVG(CASE WHEN sensor_id = 3 THEN CAST(record_value AS double precision) END), 0) AS light_avg,
        COALESCE(AVG(CASE WHEN sensor_id = 4 THEN CAST(record_value AS double precision) END), 0) AS airquality_avg,
        record_time AS record_date
    FROM record
    WHERE record_time BETWEEN :startDate AND :endDate
    GROUP BY record_date
    ORDER BY record_date
""", nativeQuery = true)
    List<Object[]> findWeeklyAverage(@Param("startDate") LocalDateTime startDate,
                                     @Param("endDate") LocalDateTime endDate);

    @Query(value = """
    SELECT 
        COALESCE(AVG(CASE WHEN sensor_id = 1 THEN CAST(record_value AS double precision) END), 0) AS temperature_avg,
        COALESCE(AVG(CASE WHEN sensor_id = 2 THEN CAST(record_value AS double precision) END), 0) AS humidity_avg,
        COALESCE(AVG(CASE WHEN sensor_id = 3 THEN CAST(record_value AS double precision) END), 0) AS light_avg,
        COALESCE(AVG(CASE WHEN sensor_id = 4 THEN CAST(record_value AS double precision) END), 0) AS airquality_avg,
        record_time::date AS record_date
    FROM record
    WHERE record_time::date = :recordDate
    GROUP BY record_date
    ORDER BY record_date
""", nativeQuery = true)
    List<Object[]> findDailyAverage(@Param("recordDate") LocalDate recordDate);
}
//CAST(record_time AS DATE) AS record_date
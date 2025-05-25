package com.andy.iot.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "record")
public class SensorRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Integer id;
    @Column(name = "record_time")
    private LocalDateTime time;
    @Column(name = "record_value")
    private String value;

    @ManyToOne
    @JoinColumn(name = "sensor_id")
    private Sensor sensor;
}

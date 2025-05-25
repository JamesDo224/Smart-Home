package com.andy.iot.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "device_status_log")
public class DeviceStatusLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device;

    private String status; // ON or OFF
    private String source; // USER or AUTO

    private LocalDateTime createdAt = LocalDateTime.now();
}

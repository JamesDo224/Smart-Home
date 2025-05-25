package com.andy.iot.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "sensor")
public class Sensor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sensor_id")
    private Integer id;
    @Column(name = "sensor_type")
    private String type;
    @Column(name = "feed_name")
    private String feedName;

    @ManyToOne
    @JoinColumn(name = "server_account_id")
    private ServerAccount serverAccount;
}

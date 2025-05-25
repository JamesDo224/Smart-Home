package com.andy.iot.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "device_id")
    private Integer id;
    private String name;
    private String feedName;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "server_account_id")
    private ServerAccount serverAccount;
}

package com.andy.iot.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "notification_log")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_log_id")
    private Integer id;
    private LocalDateTime time;
    private String description;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "server_account_id")
    private ServerAccount serverAccount;
}

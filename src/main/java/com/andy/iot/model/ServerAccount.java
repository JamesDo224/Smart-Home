package com.andy.iot.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

@Data
@Entity
@Table(name = "server_account")
public class ServerAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "server_account_id")
    private Integer id;
    @Column(name = "aio_key")
    private String aioKey;
    @Column(name = "aio_username")
    private String aio_username;
    private boolean active;

    @ManyToOne
    @JoinColumn(name = "username")
    private User user;
}

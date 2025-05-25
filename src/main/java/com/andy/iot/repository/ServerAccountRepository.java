package com.andy.iot.repository;

import com.andy.iot.model.ServerAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServerAccountRepository extends JpaRepository<ServerAccount, Integer> {
}

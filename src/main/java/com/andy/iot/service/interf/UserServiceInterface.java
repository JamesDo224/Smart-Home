package com.andy.iot.service.interf;

import com.andy.iot.dto.LoginRequest;
import com.andy.iot.dto.UserDTO;
import com.andy.iot.model.User;
import com.andy.iot.response.LoginResponse;

public interface UserServiceInterface {
    void register (User user) throws RuntimeException;
    LoginResponse login(LoginRequest loginRequest) throws RuntimeException;

    UserDTO getMyInfo() throws RuntimeException;
}

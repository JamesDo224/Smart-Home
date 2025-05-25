package com.andy.iot.response;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String expirationTime;
}

package com.andy.iot.controller;

import com.andy.iot.dto.LoginRequest;
import com.andy.iot.dto.UserDTO;
import com.andy.iot.model.Notification;
import com.andy.iot.model.User;
import com.andy.iot.response.ApiResponse;
import com.andy.iot.response.LoginResponse;
import com.andy.iot.service.interf.UserServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final UserServiceInterface userService;

    @PostMapping("/register")
    private ResponseEntity<ApiResponse<Void>> register(@RequestBody User user){
        try {
            userService.register(user);
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .status(HttpStatus.OK.value())
                    .message("Register successfully.")
                    .data(null)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.<Void>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message(e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }

    @PostMapping("/login")
    private ResponseEntity<ApiResponse<LoginResponse>> register(@RequestBody LoginRequest loginRequest){
        try {
            LoginResponse response = userService.login(loginRequest);
            return ResponseEntity.ok(ApiResponse.<LoginResponse>builder()
                    .status(HttpStatus.OK.value())
                    .message("Login successfully.")
                    .data(response)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.<LoginResponse>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message(e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }

    @GetMapping("/info")
    private ResponseEntity<ApiResponse<UserDTO>> getInfo(){
        try {
            UserDTO user = userService.getMyInfo();
            return ResponseEntity.ok(ApiResponse.<UserDTO>builder()
                    .status(HttpStatus.OK.value())
                    .message("Get info successfully.")
                    .data(user)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ApiResponse.<UserDTO>builder()
                            .status(HttpStatus.NOT_FOUND.value())
                            .message(e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }
}

package com.andy.iot.service.implement;

import com.andy.iot.dto.LoginRequest;
import com.andy.iot.dto.UserDTO;
import com.andy.iot.model.User;
import com.andy.iot.repository.UserRepository;
import com.andy.iot.response.LoginResponse;
import com.andy.iot.service.interf.UserServiceInterface;
import com.andy.iot.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserServiceInterface {
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    @Override
    public void register(User user) throws RuntimeException{

        if(userRepository.existsByUsername(user.getUsername())){
            throw new RuntimeException("This username already existed, please choose another username");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest) throws RuntimeException{
        LoginResponse response = new LoginResponse();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        var user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow(() -> new RuntimeException("Username not found"));
        String jwt = jwtUtils.generateToken(user);
        response.setToken(jwt);
        response.setExpirationTime("1 day");

        return response;
    }

    @Override
    public UserDTO getMyInfo() throws RuntimeException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(user.getUsername());
        userDTO.setFullName(user.getFullName());
        userDTO.setPhone(user.getPhone());
        userDTO.setEmail(user.getEmail());
        userDTO.setAddress(user.getAddress());
        return userDTO;
    }
}

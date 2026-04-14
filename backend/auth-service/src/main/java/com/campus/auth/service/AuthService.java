package com.campus.auth.service;

import com.campus.auth.dto.AuthResponse;
import com.campus.auth.dto.LoginRequest;
import com.campus.auth.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}

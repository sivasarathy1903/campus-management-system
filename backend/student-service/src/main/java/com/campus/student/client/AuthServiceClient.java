package com.campus.student.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "auth-service", url = "http://localhost:8081/api/auth")
public interface AuthServiceClient {

    @PostMapping("/register")
    ResponseEntity<?> registerUser(@RequestBody AuthRegisterRequest request);
}

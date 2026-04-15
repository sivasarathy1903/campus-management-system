package com.campus.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // Allowed origins (Strictly pointing to production frontend)
        corsConfig.setAllowedOrigins(Collections.singletonList("https://campus-management-system-amber.vercel.app"));
        
        // Allowed HTTP methods
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Allowed headers (Standardizing to all headers for flexibility with JWT)
        corsConfig.setAllowedHeaders(Collections.singletonList("*"));
        
        // Allow credentials (CRITICAL: Must match with setAllowedOrigins being exact)
        corsConfig.setAllowCredentials(true);
        
        // Max age for preflight requests
        corsConfig.setMaxAge(3600L); // 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}

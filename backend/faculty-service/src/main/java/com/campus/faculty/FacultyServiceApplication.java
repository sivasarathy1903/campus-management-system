package com.campus.faculty;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class FacultyServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(FacultyServiceApplication.class, args);
    }
}

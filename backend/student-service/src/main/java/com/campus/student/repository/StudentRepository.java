package com.campus.student.repository;

import com.campus.student.model.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByEmail(String email);
    
    Page<Student> findByNameContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
            String name, String department, Pageable pageable);
}

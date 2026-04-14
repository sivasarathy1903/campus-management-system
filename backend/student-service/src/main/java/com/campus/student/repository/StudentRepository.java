package com.campus.student.repository;

import com.campus.student.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
    
    Page<Student> findByNameContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
            String name, String department, Pageable pageable);
}

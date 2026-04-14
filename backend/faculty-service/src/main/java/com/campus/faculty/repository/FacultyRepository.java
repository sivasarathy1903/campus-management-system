package com.campus.faculty.repository;

import com.campus.faculty.entity.Faculty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Page<Faculty> findByNameContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
            String name, String department, Pageable pageable);
}

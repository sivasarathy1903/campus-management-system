package com.campus.faculty.repository;

import com.campus.faculty.model.Faculty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacultyRepository extends MongoRepository<Faculty, String> {
    Page<Faculty> findByNameContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
            String name, String department, Pageable pageable);
}

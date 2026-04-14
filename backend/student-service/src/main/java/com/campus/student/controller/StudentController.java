package com.campus.student.controller;

import com.campus.student.dto.StudentDto;
import com.campus.student.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    public ResponseEntity<StudentDto> createStudent(
            @Valid @RequestBody StudentDto studentDto,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-Username") String email) {
        return new ResponseEntity<>(studentService.createStudent(studentDto, role, email), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDto> getStudent(
            @PathVariable Long id,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-Username") String email) {
        return ResponseEntity.ok(studentService.getStudentById(id, role, email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDto> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentDto studentDto,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-Username") String email) {
        return ResponseEntity.ok(studentService.updateStudent(id, studentDto, role, email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(
            @PathVariable Long id,
            @RequestHeader("X-User-Role") String role) {
        studentService.deleteStudent(id, role);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<StudentDto>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String dir) {
        return ResponseEntity.ok(studentService.getAllStudents(page, size, sortBy, dir));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<StudentDto>> searchStudents(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(studentService.searchStudents(keyword, page, size));
    }
}

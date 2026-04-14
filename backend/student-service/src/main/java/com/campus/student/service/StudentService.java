package com.campus.student.service;

import com.campus.student.dto.StudentDto;
import org.springframework.data.domain.Page;

public interface StudentService {
    StudentDto createStudent(StudentDto studentDto, String requesterRole, String requesterEmail);
    StudentDto updateStudent(Long id, StudentDto studentDto, String requesterRole, String requesterEmail);
    void deleteStudent(Long id, String requesterRole);
    StudentDto getStudentById(Long id, String requesterRole, String requesterEmail);
    Page<StudentDto> getAllStudents(int page, int size, String sortBy, String dir);
    Page<StudentDto> searchStudents(String keyword, int page, int size);
}

package com.campus.student.service;

import com.campus.student.dto.StudentDto;
import org.springframework.data.domain.Page;

public interface StudentService {
    StudentDto createStudent(StudentDto studentDto, String requesterRole, String requesterEmail);
    StudentDto updateStudent(String id, StudentDto studentDto, String requesterRole, String requesterEmail);
    void deleteStudent(String id, String requesterRole);
    StudentDto getStudentById(String id, String requesterRole, String requesterEmail);
    StudentDto uploadPhoto(String id, org.springframework.web.multipart.MultipartFile file, String requesterRole, String requesterEmail);
    Page<StudentDto> getAllStudents(int page, int size, String sortBy, String dir);
    Page<StudentDto> searchStudents(String keyword, int page, int size);
}

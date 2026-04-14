package com.campus.student.service;

import com.campus.student.client.AuthRegisterRequest;
import com.campus.student.client.AuthServiceClient;
import com.campus.student.dto.StudentDto;
import com.campus.student.entity.Student;
import com.campus.student.exception.ResourceNotFoundException;
import com.campus.student.exception.UnauthorizedAccessException;
import com.campus.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final AuthServiceClient authServiceClient;

    @Override
    @Transactional
    public StudentDto createStudent(StudentDto studentDto, String requesterRole, String requesterEmail) {
        if (!"ROLE_ADMIN".equals(requesterRole) && !"ROLE_FACULTY".equals(requesterRole)) {
            throw new UnauthorizedAccessException("Only ADMIN or FACULTY can create student profiles directly.");
        }

        // Check if student exists
        if (studentRepository.findByEmail(studentDto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Student with this email already exists");
        }

        Student student = Student.builder()
                .name(studentDto.getName())
                .department(studentDto.getDepartment())
                .email(studentDto.getEmail())
                .createdBy(requesterEmail)
                .build();
        
        student = studentRepository.save(student);

        // Optional: Call Auth Service to generate login credentials for this student
        try {
            AuthRegisterRequest authRequest = AuthRegisterRequest.builder()
                    .email(student.getEmail())
                    .password("default123") // Default password
                    .role("ROLE_STUDENT")
                    .build();
            authServiceClient.registerUser(authRequest);
        } catch (Exception e) {
            // Log it, but don't fail student creation
            System.err.println("Failed to create auth user for student: " + e.getMessage());
        }

        return mapToDto(student);
    }

    @Override
    public StudentDto updateStudent(Long id, StudentDto studentDto, String requesterRole, String requesterEmail) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        // ADMIN can update any, FACULTY can only update their own
        if (!"ROLE_ADMIN".equals(requesterRole) && !requesterEmail.equals(student.getCreatedBy())) {
            throw new UnauthorizedAccessException("Forbidden: You can only update students you explicitly created.");
        }

        student.setName(studentDto.getName());
        student.setDepartment(studentDto.getDepartment());
        
        Student updatedStudent = studentRepository.save(student);
        return mapToDto(updatedStudent);
    }

    @Override
    public void deleteStudent(Long id, String requesterRole) {
        if (!"ROLE_ADMIN".equals(requesterRole)) {
            throw new UnauthorizedAccessException("Only ADMIN can delete students");
        }
        
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        studentRepository.delete(student);
    }

    @Override
    public StudentDto getStudentById(Long id, String requesterRole, String requesterEmail) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        if ("ROLE_STUDENT".equals(requesterRole) && !student.getEmail().equals(requesterEmail)) {
            throw new UnauthorizedAccessException("You can only view your own profile directly. Use search for others.");
        }
        return mapToDto(student);
    }

    @Override
    public Page<StudentDto> getAllStudents(int page, int size, String sortBy, String dir) {
        Sort sort = dir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Student> students = studentRepository.findAll(pageable);
        return students.map(this::mapToDto);
    }

    @Override
    public Page<StudentDto> searchStudents(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Student> students = studentRepository.findByNameContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
                keyword, keyword, pageable);
        return students.map(this::mapToDto);
    }

    private StudentDto mapToDto(Student student) {
        return StudentDto.builder()
                .id(student.getId())
                .name(student.getName())
                .department(student.getDepartment())
                .email(student.getEmail())
                .createdBy(student.getCreatedBy())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }
}

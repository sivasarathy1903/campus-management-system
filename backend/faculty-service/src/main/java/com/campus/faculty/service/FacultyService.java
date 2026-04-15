package com.campus.faculty.service;

import com.campus.faculty.dto.FacultyDto;
import org.springframework.data.domain.Page;

public interface FacultyService {
    FacultyDto createFaculty(FacultyDto facultyDto);
    FacultyDto updateFaculty(String id, FacultyDto facultyDto);
    void deleteFaculty(String id);
    FacultyDto getFacultyById(String id);
    FacultyDto uploadPhoto(String id, org.springframework.web.multipart.MultipartFile file);
    Page<FacultyDto> getAllFaculty(int page, int size, String sortBy, String dir);
    Page<FacultyDto> searchFaculty(String keyword, int page, int size);
}

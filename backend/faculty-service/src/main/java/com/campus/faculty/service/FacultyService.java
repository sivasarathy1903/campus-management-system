package com.campus.faculty.service;

import com.campus.faculty.dto.FacultyDto;
import org.springframework.data.domain.Page;

public interface FacultyService {
    FacultyDto createFaculty(FacultyDto facultyDto);
    FacultyDto updateFaculty(Long id, FacultyDto facultyDto);
    void deleteFaculty(Long id);
    FacultyDto getFacultyById(Long id);
    Page<FacultyDto> getAllFaculty(int page, int size, String sortBy, String dir);
    Page<FacultyDto> searchFaculty(String keyword, int page, int size);
}

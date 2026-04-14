package com.campus.faculty.service;

import com.campus.faculty.dto.FacultyDto;
import com.campus.faculty.entity.Faculty;
import com.campus.faculty.exception.ResourceNotFoundException;
import com.campus.faculty.repository.FacultyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FacultyServiceImpl implements FacultyService {

    private final FacultyRepository facultyRepository;

    @Override
    public FacultyDto createFaculty(FacultyDto facultyDto) {
        Faculty faculty = Faculty.builder()
                .name(facultyDto.getName())
                .department(facultyDto.getDepartment())
                .designation(facultyDto.getDesignation())
                .build();
        faculty = facultyRepository.save(faculty);
        return mapToDto(faculty);
    }

    @Override
    public FacultyDto updateFaculty(Long id, FacultyDto facultyDto) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));

        faculty.setName(facultyDto.getName());
        faculty.setDepartment(facultyDto.getDepartment());
        faculty.setDesignation(facultyDto.getDesignation());
        
        Faculty updatedFaculty = facultyRepository.save(faculty);
        return mapToDto(updatedFaculty);
    }

    @Override
    public void deleteFaculty(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));
        facultyRepository.delete(faculty);
    }

    @Override
    public FacultyDto getFacultyById(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));
        return mapToDto(faculty);
    }

    @Override
    public Page<FacultyDto> getAllFaculty(int page, int size, String sortBy, String dir) {
        Sort sort = dir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return facultyRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    public Page<FacultyDto> searchFaculty(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return facultyRepository.findByNameContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
                keyword, keyword, pageable).map(this::mapToDto);
    }

    private FacultyDto mapToDto(Faculty faculty) {
        return FacultyDto.builder()
                .id(faculty.getId())
                .name(faculty.getName())
                .department(faculty.getDepartment())
                .designation(faculty.getDesignation())
                .build();
    }
}

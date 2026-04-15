package com.campus.faculty.service;

import com.campus.faculty.dto.FacultyDto;
import com.campus.faculty.model.Faculty;
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
@SuppressWarnings("null")
public class FacultyServiceImpl implements FacultyService {

    private final FacultyRepository facultyRepository;

    @Override
    public FacultyDto createFaculty(FacultyDto facultyDto) {
        Faculty faculty = Faculty.builder()
                .name(facultyDto.getName())
                .department(facultyDto.getDepartment())
                .designation(facultyDto.getDesignation())
                .imageUrl(facultyDto.getImageUrl())
                .build();
        faculty = facultyRepository.save(faculty);
        return mapToDto(faculty);
    }

    @Override
    public FacultyDto updateFaculty(String id, FacultyDto facultyDto) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));

        faculty.setName(facultyDto.getName());
        faculty.setDepartment(facultyDto.getDepartment());
        faculty.setDesignation(facultyDto.getDesignation());
        faculty.setImageUrl(facultyDto.getImageUrl());
        
        Faculty updatedFaculty = facultyRepository.save(faculty);
        return mapToDto(updatedFaculty);
    }

    @Override
    public void deleteFaculty(String id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));
        facultyRepository.delete(faculty);
    }

    @Override
    public FacultyDto getFacultyById(String id) {
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

    @Override
    public FacultyDto uploadPhoto(String id, org.springframework.web.multipart.MultipartFile file) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));

        try {
            // Delete old photo if exists
            if (faculty.getProfilePhoto() != null && !faculty.getProfilePhoto().contains("default")) {
                String oldPath = faculty.getProfilePhoto().replace("/uploads/", "");
                java.nio.file.Files.deleteIfExists(java.nio.file.Paths.get("uploads").resolve(oldPath));
            }

            String photoPath = com.campus.faculty.util.FileStorageUtil.saveFile("faculty", file);
            faculty.setProfilePhoto(photoPath);
            faculty = facultyRepository.save(faculty);

            return mapToDto(faculty);
        } catch (java.io.IOException e) {
            throw new RuntimeException("Failed to store photo: " + e.getMessage(), e);
        }
    }

    private FacultyDto mapToDto(Faculty faculty) {
        String profilePhoto = faculty.getProfilePhoto();
        if (profilePhoto == null || profilePhoto.isEmpty()) {
            profilePhoto = "https://ui-avatars.com/api/?name=" + faculty.getName().replace(" ", "+") + "&background=random";
        }

        return FacultyDto.builder()
                .id(faculty.getId())
                .name(faculty.getName())
                .department(faculty.getDepartment())
                .designation(faculty.getDesignation())
                .profilePhoto(profilePhoto)
                .imageUrl(faculty.getImageUrl())
                .build();
    }
}

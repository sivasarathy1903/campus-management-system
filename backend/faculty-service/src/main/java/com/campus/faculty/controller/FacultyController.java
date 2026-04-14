package com.campus.faculty.controller;

import com.campus.faculty.dto.FacultyDto;
import com.campus.faculty.service.FacultyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
public class FacultyController {

    private final FacultyService facultyService;

    @PostMapping
    public ResponseEntity<FacultyDto> createFaculty(@Valid @RequestBody FacultyDto facultyDto) {
        return new ResponseEntity<>(facultyService.createFaculty(facultyDto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FacultyDto> getFaculty(@PathVariable Long id) {
        return ResponseEntity.ok(facultyService.getFacultyById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FacultyDto> updateFaculty(@PathVariable Long id, @Valid @RequestBody FacultyDto facultyDto) {
        return ResponseEntity.ok(facultyService.updateFaculty(id, facultyDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFaculty(@PathVariable Long id) {
        facultyService.deleteFaculty(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<FacultyDto>> getAllFaculty(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String dir) {
        return ResponseEntity.ok(facultyService.getAllFaculty(page, size, sortBy, dir));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<FacultyDto>> searchFaculty(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(facultyService.searchFaculty(keyword, page, size));
    }
}

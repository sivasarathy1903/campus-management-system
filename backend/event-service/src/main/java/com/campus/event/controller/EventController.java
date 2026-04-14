package com.campus.event.controller;

import com.campus.event.dto.EventDto;
import com.campus.event.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    // Only Admin & Faculty (Filtered in Service layer based on header)
    @PostMapping
    public ResponseEntity<EventDto> createEvent(
            @Valid @RequestBody EventDto eventDto,
            @RequestHeader("X-User-Role") String role) {
        return new ResponseEntity<>(eventService.createEvent(eventDto, role), HttpStatus.CREATED);
    }

    // Anyone can view
    @GetMapping("/{id}")
    public ResponseEntity<EventDto> getEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    // Only Admin & Faculty
    @PutMapping("/{id}")
    public ResponseEntity<EventDto> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventDto eventDto,
            @RequestHeader("X-User-Role") String role) {
        return ResponseEntity.ok(eventService.updateEvent(id, eventDto, role));
    }

    // Only Admin & Faculty
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long id,
            @RequestHeader("X-User-Role") String role) {
        eventService.deleteEvent(id, role);
        return ResponseEntity.noContent().build();
    }

    // Anyone can view all events
    @GetMapping
    public ResponseEntity<Page<EventDto>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "asc") String dir) {
        return ResponseEntity.ok(eventService.getAllEvents(page, size, sortBy, dir));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<EventDto>> searchEvents(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(eventService.searchEventsByName(name, page, size));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<Page<EventDto>> getUpcomingEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(eventService.getUpcomingEvents(page, size));
    }
}

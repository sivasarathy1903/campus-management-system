package com.campus.event.service;

import com.campus.event.dto.EventDto;
import com.campus.event.entity.Event;
import com.campus.event.exception.ResourceNotFoundException;
import com.campus.event.exception.UnauthorizedAccessException;
import com.campus.event.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    @Override
    public EventDto createEvent(EventDto eventDto, String requesterRole) {
        if ("ROLE_STUDENT".equals(requesterRole)) {
            throw new UnauthorizedAccessException("Students are not allowed to create events.");
        }

        Event event = Event.builder()
                .name(eventDto.getName())
                .location(eventDto.getLocation())
                .date(eventDto.getDate())
                .description(eventDto.getDescription())
                .build();
        
        event = eventRepository.save(event);
        return mapToDto(event);
    }

    @Override
    public EventDto updateEvent(Long id, EventDto eventDto, String requesterRole) {
        if ("ROLE_STUDENT".equals(requesterRole)) {
            throw new UnauthorizedAccessException("Students are not allowed to update events.");
        }

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        event.setName(eventDto.getName());
        event.setLocation(eventDto.getLocation());
        event.setDate(eventDto.getDate());
        event.setDescription(eventDto.getDescription());
        
        Event updatedEvent = eventRepository.save(event);
        return mapToDto(updatedEvent);
    }

    @Override
    public void deleteEvent(Long id, String requesterRole) {
        if ("ROLE_STUDENT".equals(requesterRole)) {
            throw new UnauthorizedAccessException("Students are not allowed to delete events.");
        }

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        
        eventRepository.delete(event);
    }

    @Override
    public EventDto getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return mapToDto(event);
    }

    @Override
    public Page<EventDto> getAllEvents(int page, int size, String sortBy, String dir) {
        Sort sort = dir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return eventRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    public Page<EventDto> searchEventsByName(String name, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return eventRepository.findByNameContainingIgnoreCase(name, pageable).map(this::mapToDto);
    }

    @Override
    public Page<EventDto> getUpcomingEvents(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").ascending());
        // Show events from yesterday onwards
        return eventRepository.findByDateAfter(LocalDate.now().minusDays(1), pageable).map(this::mapToDto);
    }

    private EventDto mapToDto(Event event) {
        return EventDto.builder()
                .id(event.getId())
                .name(event.getName())
                .location(event.getLocation())
                .date(event.getDate())
                .description(event.getDescription())
                .build();
    }
}

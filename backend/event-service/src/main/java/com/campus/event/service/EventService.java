package com.campus.event.service;

import com.campus.event.dto.EventDto;
import org.springframework.data.domain.Page;

import java.time.LocalDate;

public interface EventService {
    EventDto createEvent(EventDto eventDto, String requesterRole);
    EventDto updateEvent(Long id, EventDto eventDto, String requesterRole);
    void deleteEvent(Long id, String requesterRole);
    EventDto getEventById(Long id);
    Page<EventDto> getAllEvents(int page, int size, String sortBy, String dir);
    Page<EventDto> searchEventsByName(String name, int page, int size);
    Page<EventDto> getUpcomingEvents(int page, int size);
}

package com.campus.event.service;

import com.campus.event.dto.EventDto;
import org.springframework.data.domain.Page;

public interface EventService {
    EventDto createEvent(EventDto eventDto, String requesterRole);
    EventDto updateEvent(String id, EventDto eventDto, String requesterRole);
    void deleteEvent(String id, String requesterRole);
    EventDto getEventById(String id);
    EventDto uploadPhotos(String id, org.springframework.web.multipart.MultipartFile[] files);
    Page<EventDto> getAllEvents(int page, int size, String sortBy, String dir);
    Page<EventDto> searchEventsByName(String name, int page, int size);
    Page<EventDto> getUpcomingEvents(int page, int size);
}

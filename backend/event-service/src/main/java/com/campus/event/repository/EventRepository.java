package com.campus.event.repository;

import com.campus.event.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    Page<Event> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Event> findByDateAfter(LocalDate date, Pageable pageable);
}

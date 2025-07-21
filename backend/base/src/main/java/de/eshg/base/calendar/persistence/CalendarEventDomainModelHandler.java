/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.persistence;

import static org.springframework.data.domain.PageRequest.ofSize;

import de.eshg.base.calendar.api.BaseEventRequest;
import de.eshg.base.calendar.api.BusinessCaseEventRequest;
import de.eshg.base.calendar.api.TimeRange;
import de.eshg.base.calendar.mapper.CalendarData;
import de.eshg.base.calendar.mapper.CalendarEventData;
import de.eshg.base.calendar.mapper.CalendarEventMapper;
import de.eshg.base.calendar.persistence.entity.Calendar;
import de.eshg.base.calendar.persistence.entity.CalendarEvent;
import de.eshg.base.calendar.persistence.entity.CalendarEventMutex;
import de.eshg.base.calendar.persistence.entity.CalendarEvent_;
import de.eshg.base.calendar.persistence.repository.CalendarEventMutexRepository;
import de.eshg.base.calendar.persistence.repository.CalendarEventRepository;
import de.eshg.base.calendar.persistence.repository.CalendarRepository;
import de.eshg.base.notification.AbsenceNotificationService;
import de.eshg.domain.model.BaseEntityWithExternalId_;
import de.eshg.domain.model.BaseEntity_;
import de.eshg.rest.service.error.NotFoundException;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class CalendarEventDomainModelHandler {
  private static final int MUTEX_EXPIRY_SECONDS = 180;

  private final CalendarRepository calendarRepository;
  private final CalendarEventRepository calendarEventRepository;
  private final CalendarEventMutexRepository calendarEventMutexRepository;

  private final AbsenceNotificationService absenceNotificationService;

  public CalendarEventDomainModelHandler(
      CalendarRepository calendarRepository,
      CalendarEventRepository calendarEventRepository,
      CalendarEventMutexRepository calendarEventMutexRepository,
      AbsenceNotificationService absenceNotificationService) {
    this.calendarRepository = calendarRepository;
    this.calendarEventRepository = calendarEventRepository;
    this.calendarEventMutexRepository = calendarEventMutexRepository;
    this.absenceNotificationService = absenceNotificationService;
  }

  @Transactional
  public void deleteObsoleteMutexes(List<UUID> calendarExternalIds, Instant now) {
    calendarEventMutexRepository.deleteAll(
        calendarEventMutexRepository.findAllByCalendarExternalIdIn(calendarExternalIds).stream()
            .filter(mutex -> mutex.getExpiryTime().isBefore(now))
            .toList());
  }

  @Transactional
  public void saveNewMutexes(List<UUID> calendarExternalIds) {
    calendarExternalIds.forEach(this::saveMutex);
  }

  private void saveMutex(UUID calendarExternalId) {
    CalendarEventMutex mutex = new CalendarEventMutex();
    mutex.setCalendarExternalId(calendarExternalId);
    mutex.setExpiryTime(Instant.now().plusSeconds(MUTEX_EXPIRY_SECONDS));
    calendarEventMutexRepository.save(mutex);
  }

  @Transactional
  public void deleteMutexes(List<UUID> calendarExternalIds) {
    calendarEventMutexRepository.deleteAll(
        calendarEventMutexRepository.findAllByCalendarExternalIdIn(calendarExternalIds));
  }

  @Transactional(readOnly = true)
  public List<CalendarData> findCalendarsById(List<UUID> calendarExternalIds) {
    return calendarRepository.findAllByExternalIdInOrderById(calendarExternalIds).stream()
        .map(CalendarData::new)
        .toList();
  }

  @Transactional(readOnly = true)
  public Optional<CalendarEventData> findEvent(UUID eventExternalId) {
    Optional<CalendarEvent> optionalEvent =
        calendarEventRepository.findByExternalId(eventExternalId);
    return optionalEvent.map(CalendarEventData::new);
  }

  @Transactional
  public CalendarEventData saveNewEvent(
      BaseEventRequest request, List<CalendarData> calendarDatas, UUID userId) {
    CalendarEvent calendarEvent =
        calendarEventRepository.save(
            CalendarEventMapper.mapToPersistence(request, findCalendars(calendarDatas), userId));
    absenceNotificationService.createAbsenceNotificationIfNeeded(calendarEvent);
    return new CalendarEventData(calendarEvent);
  }

  @Transactional
  public CalendarEventData saveNewEvent(
      BusinessCaseEventRequest request, List<CalendarData> calendarDatas, UUID userId) {
    return new CalendarEventData(
        calendarEventRepository.save(
            CalendarEventMapper.mapToPersistence(request, findCalendars(calendarDatas), userId)));
  }

  @Transactional
  public CalendarEventData updateEvent(
      UUID eventExternalId,
      BaseEventRequest request,
      List<CalendarData> calendarDatas,
      UUID userId) {
    CalendarEvent eventToUpdate = calendarEventRepository.getByExternalId(eventExternalId);
    CalendarEventMapper.mapToPersistence(
        request, findCalendars(calendarDatas), eventToUpdate, userId);
    absenceNotificationService.createAbsenceNotificationIfNeeded(eventToUpdate);
    return new CalendarEventData(eventToUpdate);
  }

  @Transactional
  public CalendarEventData updateEvent(
      UUID eventExternalId,
      BusinessCaseEventRequest request,
      List<CalendarData> calendarDatas,
      UUID userId) {
    CalendarEvent eventToUpdate = calendarEventRepository.getByExternalId(eventExternalId);
    CalendarEventMapper.mapToPersistence(
        request, findCalendars(calendarDatas), eventToUpdate, userId);
    return new CalendarEventData(eventToUpdate);
  }

  @Transactional
  public void deleteEvent(UUID eventExternalId) {
    calendarEventRepository.deleteByExternalId(eventExternalId);
  }

  @Transactional(readOnly = true)
  public List<CalendarEventData> findEventsInCalendar(
      UUID calendarExternalId, Instant timeRangeStart, Instant timeRangeEnd) {
    return calendarEventRepository
        .findAll(
            isInCalendar(calendarExternalId).and(timeRangeOverlaps(timeRangeStart, timeRangeEnd)),
            ofSize(Integer.MAX_VALUE)
                .withSort(Sort.Direction.ASC, CalendarEvent_.EVENT_START, BaseEntity_.ID))
        .stream()
        .map(CalendarEventData::new)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<CalendarEventData> findBusyEventsInCalendars(
      List<UUID> calendarExternalIds, List<TimeRange> timeRanges) {
    return timeRanges.stream()
        .map(
            timeRange ->
                calendarEventRepository
                    .findAll(
                        busyEventsOfCalendarsSpecification(
                            calendarExternalIds, timeRange.start(), timeRange.end()),
                        ofSize(Integer.MAX_VALUE))
                    .stream()
                    .map(CalendarEventData::new)
                    .toList())
        .flatMap(Collection::stream)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<CalendarEventData> findEventsById(List<UUID> eventExternalIds) {
    return calendarEventRepository.findAllByExternalIdInOrderById(eventExternalIds).stream()
        .map(CalendarEventData::new)
        .toList();
  }

  private List<Calendar> findCalendars(List<CalendarData> calendarDatas) {
    List<Calendar> calendars =
        calendarRepository.findAllByExternalIdInOrderById(
            calendarDatas.stream().map(CalendarData::getExternalId).toList());
    if (calendars.size() != calendarDatas.size()) {
      throw new NotFoundException("Not all calendars found");
    }
    return calendars;
  }

  @Transactional(readOnly = true)
  public List<CalendarEventData> findEventsInCalendarsUnsorted(
      List<UUID> calendarExternalIds, Instant timeRangeStart, Instant timeRangeEnd) {
    return calendarEventRepository
        .findAll(
            isInCalendars(calendarExternalIds).and(timeRangeOverlaps(timeRangeStart, timeRangeEnd)))
        .stream()
        .map(CalendarEventData::new)
        .toList();
  }

  private static Specification<CalendarEvent> busyEventsOfCalendarsSpecification(
      List<UUID> calendarExternalIds, Instant timeRangeStart, Instant timeRangeEnd) {
    return (Root<CalendarEvent> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
      Specification<CalendarEvent> specification =
          isInCalendars(calendarExternalIds).and(timeRangeOverlaps(timeRangeStart, timeRangeEnd));

      query.multiselect(
          criteriaBuilder.construct(
              CalendarEvent.class,
              root.get(BaseEntityWithExternalId_.externalId),
              root.get(CalendarEvent_.eventStart),
              root.get(CalendarEvent_.eventEnd),
              root.get(CalendarEvent_.wholeDay)));

      return specification.toPredicate(root, query, criteriaBuilder);
    };
  }

  private static Specification<CalendarEvent> isInCalendar(UUID calendarExternalId) {
    return (Root<CalendarEvent> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) ->
        criteriaBuilder.equal(
            root.join(CalendarEvent_.CALENDARS).get(BaseEntityWithExternalId_.EXTERNAL_ID),
            calendarExternalId);
  }

  private static Specification<CalendarEvent> isInCalendars(List<UUID> calendarExternalIds) {
    return (Root<CalendarEvent> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) ->
        root.join(CalendarEvent_.CALENDARS)
            .get(BaseEntityWithExternalId_.EXTERNAL_ID)
            .in(calendarExternalIds);
  }

  private static Specification<CalendarEvent> timeRangeOverlaps(
      Instant timeRangeStart, Instant timeRangeEnd) {
    return (Root<CalendarEvent> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) ->
        criteriaBuilder.or(
            criteriaBuilder.or(
                criteriaBuilder.and(
                    criteriaBuilder.greaterThanOrEqualTo(
                        root.get(CalendarEvent_.eventStart), timeRangeStart),
                    criteriaBuilder.lessThan(root.get(CalendarEvent_.eventStart), timeRangeEnd)),
                criteriaBuilder.and(
                    criteriaBuilder.greaterThan(root.get(CalendarEvent_.eventEnd), timeRangeStart),
                    criteriaBuilder.lessThanOrEqualTo(
                        root.get(CalendarEvent_.eventEnd), timeRangeEnd))),
            criteriaBuilder.and(
                criteriaBuilder.lessThan(root.get(CalendarEvent_.eventStart), timeRangeStart),
                criteriaBuilder.greaterThan(root.get(CalendarEvent_.eventEnd), timeRangeEnd)));
  }
}

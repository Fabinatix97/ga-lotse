/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import static java.time.temporal.ChronoUnit.DAYS;

import de.eshg.base.SortDirection;
import de.eshg.lib.appointmentblock.api.*;
import de.eshg.lib.appointmentblock.client.CalendarClient;
import de.eshg.lib.appointmentblock.model.*;
import de.eshg.lib.appointmentblock.persistence.AppointmentBlockGroupRepository;
import de.eshg.lib.appointmentblock.persistence.AppointmentBlockGroupSpecification;
import de.eshg.lib.appointmentblock.persistence.AppointmentBlockRepository;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.AppointmentTypeRepository;
import de.eshg.lib.appointmentblock.persistence.entity.*;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.lib.contact.ContactClient;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.time.Clock;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Stream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class AppointmentBlockService {

  private final AppointmentBlockGroupRepository appointmentBlockGroupRepository;
  private final AppointmentBlockRepository appointmentBlockRepository;
  private final AppointmentTypeRepository appointmentTypeRepository;
  private final CalendarClient calendarClient;
  private final ContactClient contactClient;
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;
  private final AppointmentBlockValidator appointmentBlockValidator;
  private final AppointmentBlockProperties appointmentBlockProperties;
  private final Clock clock;

  public AppointmentBlockService(
      AppointmentBlockGroupRepository appointmentBlockGroupRepository,
      AppointmentBlockRepository appointmentBlockRepository,
      AppointmentTypeRepository appointmentTypeRepository,
      CalendarClient calendarClient,
      ContactClient contactClient,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil,
      AppointmentBlockValidator appointmentBlockValidator,
      AppointmentBlockProperties appointmentBlockProperties,
      Clock clock) {
    this.appointmentBlockGroupRepository = appointmentBlockGroupRepository;
    this.appointmentBlockRepository = appointmentBlockRepository;
    this.appointmentTypeRepository = appointmentTypeRepository;
    this.calendarClient = calendarClient;
    this.contactClient = contactClient;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
    this.appointmentBlockValidator = appointmentBlockValidator;
    this.appointmentBlockProperties = appointmentBlockProperties;
    this.clock = clock;
  }

  private void checkForCalendarConflicts(
      List<UUID> usersForEvent, List<CreateAppointmentBlockData> appointmentBlockSlots) {
    if (appointmentBlockProperties.isAllowAppointmentBlocksWithCalendarEventConflicts()
        || usersForEvent.isEmpty()) {
      return;
    }
    if (!calendarClient
        .getUserIdsWithEventConflicts(usersForEvent, appointmentBlockSlots)
        .isEmpty()) {
      throw new BadRequestException(
          "Can't create appointment blocks because of calendar event conflicts for physicians or MFAs.");
    }
  }

  public PagedAppointmentBlockGroups findFutureAppointmentBlockGroups(
      AppointmentBlockPaginationAndSortParameters parameters) {
    AppointmentBlockGroupPageSpec pageSpec = createPageSpec(parameters);
    Page<AppointmentBlockGroup> appointmentBlockGroups =
        appointmentBlockGroupRepository.findAll(
            new AppointmentBlockGroupSpecification(
                Instant.now(clock), pageSpec.sortKey(), pageSpec.direction()),
            PageRequest.of(pageSpec.pageNumber(), pageSpec.pageSize()));
    List<AppointmentBlock> listOfAppointmentBlocks =
        appointmentBlockGroups.stream()
            .map(AppointmentBlockGroup::getAppointmentBlocks)
            .flatMap(Collection::stream)
            .toList();

    Map<UUID, LocationDto> locationData = resolveLocationData(appointmentBlockGroups.stream());
    Map<AppointmentBlock, AppointmentBlockData> appointmentBlockData =
        appointmentBlockSlotUtil.augmentAppointmentBlocksWithEventDetails(listOfAppointmentBlocks);
    return new PagedAppointmentBlockGroups(
        appointmentBlockGroups.stream()
            .map(
                appointmentBlockGroup ->
                    mapAppointmentBlockGroupToData(
                        appointmentBlockGroup, appointmentBlockData, locationData))
            .toList(),
        appointmentBlockGroups.getTotalElements());
  }

  private Map<UUID, LocationDto> resolveLocationData(
      Stream<AppointmentBlockGroup> appointmentBlockGroups) {
    List<UUID> contactIds =
        appointmentBlockGroups
            .map(AppointmentBlockGroup::getLocationId)
            .filter(Objects::nonNull)
            .distinct()
            .toList();
    return contactClient.getBulkContacts(
        contactIds, contact -> new LocationDto(contact.id(), contact.name()));
  }

  private AppointmentBlockGroupPageSpec createPageSpec(
      AppointmentBlockPaginationAndSortParameters paginationAndSortParameters) {
    return AppointmentMapper.mapToPageSpec(
        paginationAndSortParameters.pageNumberOrFallback(0),
        paginationAndSortParameters.pageSizeOrFallback(25),
        paginationAndSortParameters.sortKeyOrFallback(AppointmentBlockSortKey.START),
        paginationAndSortParameters.sortDirectionOrFallback(SortDirection.ASC));
  }

  public List<AppointmentDto> getFreeAppointments(
      Instant earliestStart,
      Instant latestStart,
      AppointmentType appointmentType,
      UUID locationId,
      UUID physicianId) {
    Instant start = earliestStart == null ? Instant.now(clock) : earliestStart;

    List<AppointmentBlock> appointmentBlocks =
        appointmentBlockRepository
            .findBlockByAppointmentTypeAndLocationAndAppointmentBlockEndGreaterThan(
                appointmentType, locationId, physicianId, start);

    return appointmentBlockSlotUtil
        .calculateFreeAppointmentBlockSlots(appointmentBlocks)
        .values()
        .stream()
        .flatMap(Collection::stream)
        .distinct()
        .filter(slot -> slot.start().isAfter(start))
        .filter(slot -> latestStart == null || !slot.start().isAfter(latestStart))
        .sorted(Comparator.comparing(AppointmentBlockSlot::start))
        .map(slot -> new AppointmentDto(slot.start(), slot.end()))
        .toList();
  }

  private static AppointmentBlockGroupData mapAppointmentBlockGroupToData(
      AppointmentBlockGroup appointmentBlockGroup,
      Map<AppointmentBlock, AppointmentBlockData> appointmentBlockData,
      Map<UUID, LocationDto> locationData) {

    LocationDto location =
        Optional.ofNullable(appointmentBlockGroup.getLocationId())
            .map(locationData::get)
            .orElse(null);

    return new AppointmentBlockGroupData(
        appointmentBlockGroup.getId(),
        appointmentBlockGroup.getExternalId(),
        MappingUtil.mapEnum(AppointmentTypeDto.class, appointmentBlockGroup.getType()),
        appointmentBlockGroup.getParallelExaminations(),
        location,
        mapAppointmentBlockToData(appointmentBlockGroup, appointmentBlockData));
  }

  private static List<AppointmentBlockData> mapAppointmentBlockToData(
      AppointmentBlockGroup appointmentBlockGroup,
      Map<AppointmentBlock, AppointmentBlockData> appointmentBlockData) {
    return appointmentBlockGroup.getAppointmentBlocks().stream()
        .map(appointmentBlockData::get)
        .sorted(appointmentBlockSortComparator())
        .toList();
  }

  private static Comparator<AppointmentBlockData> appointmentBlockSortComparator() {
    return Comparator.comparing(AppointmentBlockData::start)
        .thenComparing(AppointmentBlockData::end);
  }

  public CreateAppointmentBlockGroupResponse createDailyAppointmentBlocksForGroup(
      CreateDailyAppointmentBlockGroupRequest request) {

    AppointmentType appointmentType = MappingUtil.mapEnum(AppointmentType.class, request.type());
    AppointmentTypeConfig appointmentTypeConfig =
        appointmentTypeRepository
            .findByAppointmentType(appointmentType)
            .orElseThrow(
                () -> new BadRequestException("Unknown AppointmentType " + appointmentType.name()));

    appointmentBlockValidator.validateNumberOfAppointmentBlocks(request);
    appointmentBlockValidator.validateStartAndEndTimes(
        request.appointmentBlocks(), appointmentTypeConfig);
    appointmentBlockValidator.validateTechnicalGroups(
        request.physicians(), request.mfas(), request.consultants());
    appointmentBlockValidator.validateLocation(request.locationId());

    List<CreateAppointmentBlockData> appointmentBlocks = createAppointmentBlockData(request);

    if (appointmentBlocks.isEmpty()) {
      throw new BadRequestException("There is no block in the time period with given weekdays.");
    }

    List<UUID> usersForEvent =
        getUserIdsForEvent(request.physicians(), request.mfas(), request.consultants());
    checkForCalendarConflicts(usersForEvent, appointmentBlocks);

    AppointmentBlockGroup appointmentBlockGroup =
        buildAppointmentBlockGroup(request, appointmentType, appointmentTypeConfig);

    for (CreateAppointmentBlockData createAppointmentBlockRequest : appointmentBlocks) {
      AppointmentBlock appointmentBlock = new AppointmentBlock();
      UUID calendarEventId =
          calendarClient.createEventInCalendar(
              createAppointmentBlockRequest.start(),
              createAppointmentBlockRequest.end(),
              usersForEvent);
      appointmentBlock.setCalendarEventId(calendarEventId);
      appointmentBlock.setAppointmentBlockStart(createAppointmentBlockRequest.start());
      appointmentBlock.setAppointmentBlockEnd(createAppointmentBlockRequest.end());
      appointmentBlockGroup.addAppointmentBlock(appointmentBlock);
    }

    appointmentBlockGroupRepository.save(appointmentBlockGroup);

    return new CreateAppointmentBlockGroupResponse(
        appointmentBlockGroup.getExternalId(),
        appointmentBlockGroup.getAppointmentBlocks().stream()
            .map(AppointmentBlock::getExternalId)
            .toList());
  }

  private List<UUID> getUserIdsForEvent(
      List<UUID> physicians, List<UUID> mfas, List<UUID> consultants) {
    Set<UUID> usersForEvent = new HashSet<>();
    if (physicians != null) {
      usersForEvent.addAll(physicians);
    }
    if (mfas != null) {
      usersForEvent.addAll(mfas);
    }
    if (consultants != null) {
      usersForEvent.addAll(consultants);
    }
    if (appointmentBlockProperties.isCreateAppointmentBlockForCurrentUser()) {
      usersForEvent.add(CurrentUserHelper.getCurrentUserId());
    }
    if (usersForEvent.isEmpty()) {
      throw new BadRequestException("At least one user for event is needed.");
    }
    return new ArrayList<>(usersForEvent);
  }

  private static AppointmentBlockGroup buildAppointmentBlockGroup(
      CreateDailyAppointmentBlockGroupRequest request,
      AppointmentType appointmentType,
      AppointmentTypeConfig appointmentTypeConfig) {
    AppointmentBlockGroup appointmentBlockGroup = new AppointmentBlockGroup();
    appointmentBlockGroup.setType(appointmentType);
    appointmentBlockGroup.setParallelExaminations(request.parallelExaminations());
    appointmentBlockGroup.setSlotDurationInMinutes(
        appointmentTypeConfig.getStandardDurationInMinutes());
    appointmentBlockGroup.setMfas(request.mfas());
    appointmentBlockGroup.setPhysicians(request.physicians());
    appointmentBlockGroup.setConsultants(request.consultants());
    appointmentBlockGroup.setLocationId(request.locationId());
    return appointmentBlockGroup;
  }

  private List<CreateAppointmentBlockData> createAppointmentBlockData(
      CreateDailyAppointmentBlockGroupRequest request) {
    return request.appointmentBlocks().stream()
        .map(this::createDailyAppointmentBlocks)
        .flatMap(Collection::stream)
        .toList();
  }

  private List<CreateAppointmentBlockData> createDailyAppointmentBlocks(
      CreateDailyAppointmentBlockDto block) {
    if (block.start().isBefore(Instant.now(clock))) {
      throw new BadRequestException("Start of first appointment block must be in the future.");
    }

    List<CreateAppointmentBlockData> result = new ArrayList<>();

    LocalDate startDate = block.start().atZone(clock.getZone()).toLocalDate();
    LocalTime startTime = block.start().atZone(clock.getZone()).toLocalTime();
    LocalTime endTime = block.end().atZone(clock.getZone()).toLocalTime();
    long totalDays = DAYS.between(block.start(), block.end());
    for (int daysToAdd = 0; daysToAdd <= totalDays; daysToAdd++) {
      LocalDate date = startDate.plusDays(daysToAdd);
      List<DayOfWeek> daysOfWeek = DayOfWeekDtoMapper.toJavaTime(block.daysOfWeek());
      if (daysOfWeek.contains(date.getDayOfWeek())) {
        result.add(appointmentBlockData(date, startTime, endTime));
      }
    }

    return result;
  }

  private CreateAppointmentBlockData appointmentBlockData(
      LocalDate date, LocalTime startTime, LocalTime endTime) {
    Instant appointmentStart = toInstant(date, startTime);
    Instant appointmentEnd = toInstant(date, endTime);
    return new CreateAppointmentBlockData(appointmentStart, appointmentEnd);
  }

  private Instant toInstant(LocalDate date, LocalTime startTime) {
    return date.atTime(startTime).atZone(clock.getZone()).toInstant();
  }

  public ValidateAppointmentBlockGroupResponse validateDailyAppointmentBlocksForGroup(
      CreateDailyAppointmentBlockGroupRequest request) {
    List<UUID> usersForEvent =
        getUserIdsForEvent(request.physicians(), request.mfas(), request.consultants());
    if (usersForEvent.isEmpty()) {
      return new ValidateAppointmentBlockGroupResponse(
          Collections.emptyList(), Collections.emptyList());
    }
    List<CreateAppointmentBlockData> appointmentBlocks = createAppointmentBlockData(request);
    return validateAppointmentBlocks(usersForEvent, appointmentBlocks);
  }

  private ValidateAppointmentBlockGroupResponse validateAppointmentBlocks(
      List<UUID> usersForEvent, List<CreateAppointmentBlockData> appointmentBlocks) {
    if (appointmentBlocks.isEmpty()) {
      return new ValidateAppointmentBlockGroupResponse(Collections.emptyList(), usersForEvent);
    }
    List<UUID> userIdsWithEventConflicts =
        calendarClient.getUserIdsWithEventConflicts(usersForEvent, appointmentBlocks);
    List<UUID> userIdsWithoutEventConflicts = new ArrayList<>(usersForEvent);
    userIdsWithoutEventConflicts.removeAll(userIdsWithEventConflicts);
    return new ValidateAppointmentBlockGroupResponse(
        userIdsWithEventConflicts, userIdsWithoutEventConflicts);
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import static java.time.temporal.ChronoUnit.DAYS;

import de.eshg.base.SortDirection;
import de.eshg.base.client.ContactClient;
import de.eshg.base.contact.api.InstitutionContactCategoryDto;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.UserDto;
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
import de.eshg.lib.keycloak.TechnicalGroup;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.time.Clock;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Qualifier;
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
  private final UserApi userApi;
  private final AppointmentBlockProperties appointmentBlockProperties;
  private final Clock clock;

  private final Optional<TechnicalGroup> groupPhysicians;
  private final Optional<TechnicalGroup> groupMfas;
  private final Optional<TechnicalGroup> groupConsultants;

  public static final String TECHNICAL_GROUP_PHYSICIANS = "technicalGroupPhysicians";
  public static final String TECHNICAL_GROUP_MFAS = "technicalGroupMfas";
  public static final String TECHNICAL_GROUP_CONSULTANTS = "technicalGroupConsultants";

  public AppointmentBlockService(
      AppointmentBlockGroupRepository appointmentBlockGroupRepository,
      AppointmentBlockRepository appointmentBlockRepository,
      AppointmentTypeRepository appointmentTypeRepository,
      CalendarClient calendarClient,
      ContactClient contactClient,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil,
      UserApi userApi,
      AppointmentBlockProperties appointmentBlockProperties,
      Clock clock,
      @Qualifier(TECHNICAL_GROUP_PHYSICIANS) Optional<TechnicalGroup> groupPhysicians,
      @Qualifier(TECHNICAL_GROUP_MFAS) Optional<TechnicalGroup> groupMfas,
      @Qualifier(TECHNICAL_GROUP_CONSULTANTS) Optional<TechnicalGroup> groupConsultants) {
    this.appointmentBlockGroupRepository = appointmentBlockGroupRepository;
    this.appointmentBlockRepository = appointmentBlockRepository;
    this.appointmentTypeRepository = appointmentTypeRepository;
    this.calendarClient = calendarClient;
    this.contactClient = contactClient;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
    this.userApi = userApi;
    this.appointmentBlockProperties = appointmentBlockProperties;
    this.clock = clock;
    this.groupPhysicians = groupPhysicians;
    this.groupMfas = groupMfas;
    this.groupConsultants = groupConsultants;
  }

  public CreateAppointmentBlockGroupResponseData createAppointmentBlockGroup(
      AppointmentTypeDto type,
      int parallelExaminations,
      List<CreateAppointmentBlockData> appointmentBlocks,
      List<UUID> physicians,
      List<UUID> mfas,
      List<UUID> consultants,
      UUID locationId) {
    AppointmentType appointmentType = MappingUtil.mapEnum(AppointmentType.class, type);
    AppointmentTypeConfig appointmentTypeConfig =
        appointmentTypeRepository
            .findByAppointmentType(appointmentType)
            .orElseThrow(
                () -> new BadRequestException("Unknown AppointmentType " + appointmentType.name()));

    validateDuration(appointmentBlocks, appointmentTypeConfig);
    validateTechnicalGroups(physicians, mfas, consultants);
    validateLocation(locationId);

    List<UUID> usersForEvent = getUserIdsForEvent(physicians, mfas, consultants);
    checkForCalendarConflicts(usersForEvent, appointmentBlocks);

    AppointmentBlockGroup appointmentBlockGroup = new AppointmentBlockGroup();
    appointmentBlockGroup.setType(appointmentType);
    appointmentBlockGroup.setParallelExaminations(parallelExaminations);
    appointmentBlockGroup.setSlotDurationInMinutes(
        appointmentTypeConfig.getStandardDurationInMinutes());
    appointmentBlockGroup.setMfas(mfas);
    appointmentBlockGroup.setPhysicians(physicians);
    appointmentBlockGroup.setConsultants(consultants);
    appointmentBlockGroup.setLocationId(locationId);

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

    return new CreateAppointmentBlockGroupResponseData(
        appointmentBlockGroup.getExternalId(),
        appointmentBlockGroup.getAppointmentBlocks().stream()
            .map(AppointmentBlock::getExternalId)
            .toList());
  }

  private void checkForCalendarConflicts(
      List<UUID> usersForEvent, List<CreateAppointmentBlockData> appointmentBlockSlots) {
    if (appointmentBlockProperties.isAllowAppointmentBlocksWithCalendarEventConflicts()
        || usersForEvent.isEmpty()) {
      return;
    }
    if (!getUserIdsWithEventConflicts(usersForEvent, appointmentBlockSlots).isEmpty()) {
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
    return contactClient.getBulkContacts(contactIds).stream()
        .map(contact -> new LocationDto(contact.id(), contact.name()))
        .collect(Collectors.toMap(LocationDto::id, Function.identity()));
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
      UUID locationId) {
    Instant start = earliestStart == null ? Instant.now(clock) : earliestStart;

    List<AppointmentBlock> appointmentBlocks =
        appointmentBlockRepository
            .findBlockByAppointmentTypeAndLocationAndAppointmentBlockEndGreaterThan(
                appointmentType, locationId, start);

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

  private void validateDuration(
      List<CreateAppointmentBlockData> appointmentBlocks, AppointmentTypeConfig typeConfig) {
    Duration examinationDuration =
        Duration.of(typeConfig.getStandardDurationInMinutes(), ChronoUnit.MINUTES);
    for (CreateAppointmentBlockData appointmentBlock : appointmentBlocks) {
      Duration appointmentBlockLength =
          Duration.between(appointmentBlock.start(), appointmentBlock.end());
      if (!DurationUtil.isDivisible(appointmentBlockLength, examinationDuration)) {
        String errorMessage =
            "Appointment block length %s is not a multiple of examination duration %s."
                .formatted(appointmentBlockLength, examinationDuration);
        throw new BadRequestException(errorMessage);
      }
    }
  }

  private void validateTechnicalGroups(
      List<UUID> physicians, List<UUID> mfas, List<UUID> consultants) {
    if (physicians != null && !physicians.isEmpty()) {
      validateTechnicalGroup(
          physicians,
          groupPhysicians.orElseThrow(
              () ->
                  new BadRequestException(
                      "Cannot validate physicians, because technical group ist not configured.")));
    }
    if (mfas != null && !mfas.isEmpty()) {
      validateTechnicalGroup(
          mfas,
          groupMfas.orElseThrow(
              () ->
                  new BadRequestException(
                      "Cannot validate MFAs, because technical group ist not configured.")));
    }
    if (consultants != null && !consultants.isEmpty()) {
      validateTechnicalGroup(
          consultants,
          groupConsultants.orElseThrow(
              () ->
                  new BadRequestException(
                      "Cannot validate Consultants, because technical group ist not configured.")));
    }
  }

  private void validateTechnicalGroup(List<UUID> userIds, TechnicalGroup group) {
    Set<UUID> groupUserIds =
        userApi.getUsersByGroup(group.getKeycloakName()).users().stream()
            .map(UserDto::userId)
            .collect(Collectors.toCollection(LinkedHashSet::new));
    if (!groupUserIds.containsAll(userIds)) {
      throw new BadRequestException("Not all userIds belong to the correct technical group.");
    }
  }

  private void validateLocation(UUID locationId) {
    LocationSelectionMode locationSelectionMode =
        appointmentBlockProperties.getLocationSelectionMode();

    if (locationSelectionMode == LocationSelectionMode.NONE) {
      if (locationId != null) {
        throw new BadRequestException(
            "No location id may be provided when location selection mode is NONE.");
      }
    } else {
      if (locationId == null) {
        throw new BadRequestException(
            "Location id must be provided when location selection mode is %s."
                .formatted(locationSelectionMode.name()));
      }
      if (locationSelectionMode == LocationSelectionMode.SCHOOL) {
        contactClient.validateContactIsInstitutionWithCategory(
            locationId, InstitutionContactCategoryDto.SCHOOL);
      }
      if (locationSelectionMode == LocationSelectionMode.HEALTH_DEPARTMENT) {
        contactClient.validateContactIsInstitutionWithCategory(
            locationId, InstitutionContactCategoryDto.HEALTH_DEPARTMENT);
      }
    }
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

  public CreateAppointmentBlockGroupResponse createDailyAppointmentBlocksForGroup(
      CreateDailyAppointmentBlockGroupRequest request) {

    validateStartAndEndTimes(request.appointmentBlocks());

    List<CreateAppointmentBlockData> appointmentBlocks = createAppointmentBlockData(request);

    if (appointmentBlocks.isEmpty()) {
      throw new BadRequestException("There is no block in the time period with given weekdays.");
    }

    CreateAppointmentBlockGroupResponseData groupData =
        createAppointmentBlockGroup(
            request.type(),
            request.parallelExaminations(),
            appointmentBlocks,
            request.physicians(),
            request.mfas(),
            request.consultants(),
            request.locationId());
    return new CreateAppointmentBlockGroupResponse(
        groupData.appointmentBlockGroupId(), groupData.appointmentBlockIds());
  }

  private void validateStartAndEndTimes(
      List<CreateDailyAppointmentBlockDto> dailyAppointmentBlocks) {
    for (CreateDailyAppointmentBlockDto appointmentBlock : dailyAppointmentBlocks) {
      Instant start = appointmentBlock.start();
      Instant end = appointmentBlock.end();
      if (end.isBefore(start)) {
        throw new BadRequestException(
            "AppointmentBlockGroup start date must be before or equal to end date.");
      }
      if (end.atZone(clock.getZone())
          .toLocalTime()
          .isBefore(start.atZone(clock.getZone()).toLocalTime())) {
        throw new BadRequestException(
            "AppointmentBlockGroup end time of day must be after start time of day.");
      }
    }
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
        getUserIdsWithEventConflicts(usersForEvent, appointmentBlocks);
    List<UUID> userIdsWithoutEventConflicts = new ArrayList<>(usersForEvent);
    userIdsWithoutEventConflicts.removeAll(userIdsWithEventConflicts);
    return new ValidateAppointmentBlockGroupResponse(
        userIdsWithEventConflicts, userIdsWithoutEventConflicts);
  }

  private List<UUID> getUserIdsWithEventConflicts(
      List<UUID> usersForEvent, List<CreateAppointmentBlockData> appointmentBlocks) {
    return calendarClient.getUserIdsWithEventConflicts(usersForEvent, appointmentBlocks);
  }
}

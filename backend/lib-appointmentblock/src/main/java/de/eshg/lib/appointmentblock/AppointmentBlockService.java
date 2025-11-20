/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import static de.eshg.lib.appointmentblock.AppointmentTypeMapper.toInterfaceType;
import static java.time.temporal.ChronoUnit.DAYS;

import de.eshg.api.commons.SortDirection;
import de.eshg.base.user.UserApi;
import de.eshg.base.util.CollectionUtils;
import de.eshg.lib.appointmentblock.api.AppointmentBlockPaginationAndSortParameters;
import de.eshg.lib.appointmentblock.api.AppointmentBlockSortKey;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.api.CreateAppointmentBlockGroupResponse;
import de.eshg.lib.appointmentblock.api.CreateDailyAppointmentBlockDto;
import de.eshg.lib.appointmentblock.api.CreateDailyAppointmentBlockGroupRequest;
import de.eshg.lib.appointmentblock.api.DayOfWeekDto;
import de.eshg.lib.appointmentblock.api.LocationDto;
import de.eshg.lib.appointmentblock.api.UpdateAppointmentBlockRequest;
import de.eshg.lib.appointmentblock.api.ValidateAppointmentBlockGroupResponse;
import de.eshg.lib.appointmentblock.client.CalendarClient;
import de.eshg.lib.appointmentblock.model.AppointmentBlockData;
import de.eshg.lib.appointmentblock.model.AppointmentBlockGroupData;
import de.eshg.lib.appointmentblock.model.AppointmentBlockSlot;
import de.eshg.lib.appointmentblock.model.CreateAppointmentBlockData;
import de.eshg.lib.appointmentblock.persistence.AppointmentBlockGroupRepository;
import de.eshg.lib.appointmentblock.persistence.AppointmentBlockGroupSpecification;
import de.eshg.lib.appointmentblock.persistence.AppointmentBlockRepository;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockGroup;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentTypeHolder;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockConfig;
import de.eshg.lib.contact.ContactClient;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.time.Clock;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class AppointmentBlockService {

  private static final Logger log = LoggerFactory.getLogger(AppointmentBlockService.class);

  private final AppointmentBlockGroupRepository appointmentBlockGroupRepository;
  private final AppointmentBlockRepository appointmentBlockRepository;
  private final AbstractAppointmentStandardDurationService<?> appointmentStandardDurationService;
  private final CalendarClient calendarClient;
  private final ContactClient contactClient;
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;
  private final AppointmentBlockValidator appointmentBlockValidator;
  private final AppointmentBlockConfig appointmentBlockConfig;
  private final Clock clock;
  private final UserApi userApi;

  public AppointmentBlockService(
      AppointmentBlockGroupRepository appointmentBlockGroupRepository,
      AppointmentBlockRepository appointmentBlockRepository,
      AbstractAppointmentStandardDurationService<?> appointmentStandardDurationService,
      CalendarClient calendarClient,
      ContactClient contactClient,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil,
      AppointmentBlockValidator appointmentBlockValidator,
      AppointmentBlockConfig appointmentBlockConfig,
      Clock clock,
      UserApi userApi) {
    this.appointmentBlockGroupRepository = appointmentBlockGroupRepository;
    this.appointmentBlockRepository = appointmentBlockRepository;
    this.appointmentStandardDurationService = appointmentStandardDurationService;
    this.calendarClient = calendarClient;
    this.contactClient = contactClient;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
    this.appointmentBlockValidator = appointmentBlockValidator;
    this.appointmentBlockConfig = appointmentBlockConfig;
    this.clock = clock;
    this.userApi = userApi;
  }

  private void checkForCalendarConflicts(
      List<UUID> usersForEvent, List<CreateAppointmentBlockData> appointmentBlockSlots) {
    if (appointmentBlockConfig.isAllowAppointmentBlocksWithCalendarEventConflicts()
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

  public AppointmentBlock findAppointmentBlockForUpdate(UUID appointmentBlockId) {
    return appointmentBlockRepository
        .findByExternalIdForUpdate(appointmentBlockId)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "Appointment block with id " + appointmentBlockId + " not found."));
  }

  public List<String> findAllRooms() {
    return appointmentBlockRepository.findDistinctRooms();
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

    return filterAndMapAppointments(latestStart, appointmentType, appointmentBlocks, start);
  }

  public List<AppointmentDto> getFreeAppointmentsWithAvailability(
      Instant earliestStart,
      Instant latestStart,
      AppointmentType appointmentType,
      UUID locationId,
      Boolean availableForCitizen,
      Boolean availableForBulkBooking,
      UUID physician,
      UUID mfa,
      String room) {
    Instant start = earliestStart == null ? Instant.now(clock) : earliestStart;

    List<AppointmentBlock> appointmentBlocks =
        appointmentBlockRepository
            .findBlockByAvailabilityAndAppointmentTypeAndLocationAndStaffAndRoomAndAppointmentBlockEndGreaterThan(
                appointmentType,
                locationId,
                start,
                availableForCitizen,
                availableForBulkBooking,
                physician,
                mfa,
                room);

    return filterAndMapAppointments(latestStart, appointmentType, appointmentBlocks, start);
  }

  private List<AppointmentDto> filterAndMapAppointments(
      Instant latestStart,
      AppointmentType appointmentType,
      List<AppointmentBlock> appointmentBlocks,
      Instant start) {
    return appointmentBlockSlotUtil
        .calculateFreeAppointmentBlockSlotsForType(appointmentBlocks, appointmentType)
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
        appointmentBlockGroup.getTypes().stream()
            .map(type -> MappingUtil.mapEnum(AppointmentTypeDto.class, type))
            .toList(),
        location,
        mapAppointmentBlockToData(appointmentBlockGroup, appointmentBlockData),
        appointmentBlockGroup.isAvailableForCitizen(),
        appointmentBlockGroup.isAvailableForBulkBooking());
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
    AppointmentBlockGroup appointmentBlockGroup =
        createDailyAppointmentBlocksForGroup(request, false);

    return new CreateAppointmentBlockGroupResponse(
        appointmentBlockGroup.getExternalId(),
        appointmentBlockGroup.getAppointmentBlocks().stream()
            .map(AppointmentBlock::getExternalId)
            .toList());
  }

  public AppointmentBlockGroup createAdHocAppointmentBlockGroup(
      AppointmentType appointmentType,
      UUID locationId,
      Instant appointmentStart,
      Instant appointmentEnd) {
    appointmentBlockValidator.validateStartAndEndIsSameDayForAdHocAppointments(
        appointmentStart, appointmentEnd);
    appointmentBlockValidator.validateAdHocAppointmentDuration(
        appointmentStandardDurationService.getStandardDuration(appointmentType),
        appointmentStart,
        appointmentEnd);

    CreateDailyAppointmentBlockGroupRequest request =
        new CreateDailyAppointmentBlockGroupRequest(
            List.of(toInterfaceType(appointmentType)),
            1,
            List.of(
                new CreateDailyAppointmentBlockDto(
                    appointmentStart, appointmentEnd, DayOfWeekDto.allDays())),
            null,
            null,
            null,
            null,
            locationId,
            null,
            null);

    return createDailyAppointmentBlocksForGroup(request, true);
  }

  private AppointmentBlockGroup createDailyAppointmentBlocksForGroup(
      CreateDailyAppointmentBlockGroupRequest request, boolean forAdHocAppointment) {
    appointmentBlockValidator.validateNumberOfAppointmentBlocks(request);

    Set<AppointmentType> requestedTypes =
        request.types().stream()
            .map(type -> MappingUtil.mapEnum(AppointmentType.class, type))
            .collect(Collectors.toSet());

    List<AppointmentTypeHolder> appointmentTypeHolders =
        requestedTypes.stream()
            .map(
                type -> {
                  AppointmentTypeHolder holder = new AppointmentTypeHolder();
                  holder.setType(type);
                  holder.setSlotDuration(
                      appointmentStandardDurationService.getStandardDuration(type));
                  return holder;
                })
            .toList();

    Duration shortestDuration = calculateShortestDuration(appointmentTypeHolders);
    appointmentBlockValidator.validateStartAndEndTimes(
        request.appointmentBlocks(), shortestDuration);
    appointmentBlockValidator.validateTechnicalGroups(
        request.physicians(), request.mfas(), request.consultants());
    appointmentBlockValidator.validateLocation(request.locationId());

    List<CreateAppointmentBlockData> appointmentBlocks =
        createAppointmentBlockData(request, forAdHocAppointment);

    if (appointmentBlocks.isEmpty()) {
      throw new BadRequestException("There is no block in the time period with given weekdays.");
    }

    List<UUID> usersForEvent =
        getAndCheckUserIdsForEvent(request, appointmentBlocks, forAdHocAppointment);

    AppointmentBlockGroup appointmentBlockGroup =
        buildAppointmentBlockGroup(request, appointmentTypeHolders);

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
      appointmentBlock.setParallelExaminations(request.parallelExaminations());
      if (request.physicians() != null) {
        appointmentBlock.setPhysicians(request.physicians());
      }
      if (request.mfas() != null) {
        appointmentBlock.setMfas(request.mfas());
      }
      if (request.consultants() != null) {
        appointmentBlock.setConsultants(request.consultants());
      }
      appointmentBlock.setRoom(request.room() != null ? request.room().trim() : null);
      appointmentBlockGroup.addAppointmentBlock(appointmentBlock);
    }

    return appointmentBlockGroupRepository.save(appointmentBlockGroup);
  }

  private List<UUID> getAndCheckUserIdsForEvent(
      CreateDailyAppointmentBlockGroupRequest request,
      List<CreateAppointmentBlockData> appointmentBlocks,
      boolean forAdHocAppointment) {
    if (forAdHocAppointment) {
      return List.of(CurrentUserHelper.getCurrentUserId());
    }

    List<UUID> usersForEvent =
        getUserIdsForEvent(
            request.physicians(),
            request.mfas(),
            request.consultants(),
            CurrentUserHelper.getCurrentUserId());
    checkForCalendarConflicts(usersForEvent, appointmentBlocks);
    return usersForEvent;
  }

  Duration calculateShortestDuration(List<AppointmentTypeHolder> appointmentTypeHolders) {
    return appointmentTypeHolders.stream()
        .map(AppointmentTypeHolder::getSlotDuration)
        .reduce((d1, d2) -> d1.compareTo(d2) < 0 ? d1 : d2)
        .orElseThrow();
  }

  private List<UUID> getUserIdsForEvent(
      List<UUID> physicians, List<UUID> mfas, List<UUID> consultants, UUID creatorId) {
    return getUserIdsForEvent(physicians, mfas, consultants, creatorId, null);
  }

  private List<UUID> getUserIdsForEvent(
      List<UUID> physicians,
      List<UUID> mfas,
      List<UUID> consultants,
      UUID creatorId,
      UUID eventId) {
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

    if (eventId != null) {
      usersForEvent.addAll(calendarClient.getUserIdsFromEventId(eventId));
    }

    if (appointmentBlockConfig.isCreateAppointmentBlockForCurrentUser()) {
      usersForEvent.add(creatorId);
    }
    if (usersForEvent.isEmpty()) {
      throw new BadRequestException("At least one user for event is needed.");
    }
    return new ArrayList<>(usersForEvent);
  }

  private AppointmentBlockGroup buildAppointmentBlockGroup(
      CreateDailyAppointmentBlockGroupRequest request,
      List<AppointmentTypeHolder> appointmentTypeHolders) {
    AppointmentBlockGroup appointmentBlockGroup = new AppointmentBlockGroup();
    appointmentBlockGroup.setAppointmentTypeHolders(appointmentTypeHolders);
    appointmentBlockGroup.setCreatorId(userApi.getSelfUser().userId());
    appointmentBlockGroup.setLocationId(request.locationId());
    appointmentBlockGroup.setAvailableForCitizen(request.availableForCitizen());
    appointmentBlockGroup.setAvailableForBulkBooking(request.availableForBulkBooking());
    return appointmentBlockGroup;
  }

  private List<CreateAppointmentBlockData> createAppointmentBlockData(
      CreateDailyAppointmentBlockGroupRequest request) {
    return createAppointmentBlockData(request, false);
  }

  private List<CreateAppointmentBlockData> createAppointmentBlockData(
      CreateDailyAppointmentBlockGroupRequest request, boolean forAdHocAppointment) {
    return request.appointmentBlocks().stream()
        .map(block -> createDailyAppointmentBlocks(block, forAdHocAppointment))
        .flatMap(Collection::stream)
        .toList();
  }

  private List<CreateAppointmentBlockData> createDailyAppointmentBlocks(
      CreateDailyAppointmentBlockDto block, boolean forAdHocAppointment) {
    if (!forAdHocAppointment && block.start().isBefore(Instant.now(clock))) {
      throw new BadRequestException("Start of first appointment block must be in the future.");
    }
    ZonedDateTime start = block.start().atZone(clock.getZone());
    ZonedDateTime end = block.end().atZone(clock.getZone());
    List<DayOfWeek> daysOfWeek = DayOfWeekDtoMapper.toJavaTime(block.daysOfWeek());
    return createDailyAppointmentBlocks(start, end, daysOfWeek);
  }

  private static List<CreateAppointmentBlockData> createDailyAppointmentBlocks(
      ZonedDateTime start, ZonedDateTime end, List<DayOfWeek> daysOfWeek) {
    List<CreateAppointmentBlockData> result = new ArrayList<>();

    LocalTime endTime = end.toLocalTime();
    long totalDays = DAYS.between(start, end);
    for (int daysToAdd = 0; daysToAdd <= totalDays; daysToAdd++) {
      ZonedDateTime appointmentStart = start.plusDays(daysToAdd);
      if (daysOfWeek.contains(appointmentStart.getDayOfWeek())) {
        ZonedDateTime appointmentEnd = appointmentStart.with(endTime);
        result.add(
            new CreateAppointmentBlockData(
                appointmentStart.toInstant(), appointmentEnd.toInstant()));
      }
    }

    return result;
  }

  public ValidateAppointmentBlockGroupResponse validateDailyAppointmentBlocksForGroup(
      CreateDailyAppointmentBlockGroupRequest request) {
    List<UUID> usersForEvent =
        getUserIdsForEvent(
            request.physicians(),
            request.mfas(),
            request.consultants(),
            CurrentUserHelper.getCurrentUserId());
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

  public void deleteAppointmentBlock(UUID appointmentBlockId) {
    AppointmentBlock appointmentBlock =
        appointmentBlockRepository
            .findByExternalId(appointmentBlockId)
            .orElseThrow(() -> new NotFoundException("Appointment block not found"));
    if (!appointmentBlock.getAppointments().isEmpty()) {
      throw new BadRequestException("Appointment block is not empty");
    }
    AppointmentBlockGroup appointmentBlockGroup = appointmentBlock.getAppointmentBlockGroup();
    Set<AppointmentBlock> appointmentBlocks = appointmentBlockGroup.getAppointmentBlocks();
    boolean removed = appointmentBlocks.remove(appointmentBlock);
    if (!removed) {
      log.warn("Appointment block does not exist: {}", appointmentBlockId);
    }
    calendarClient.removeEventInCalendarIfExists(appointmentBlock);
    if (appointmentBlocks.isEmpty()) {
      appointmentBlockGroupRepository.delete(appointmentBlockGroup);
    }
  }

  public void updateAppointmentBlock(
      AppointmentBlock appointmentBlock, UpdateAppointmentBlockRequest request) {
    UserChange userChange = getUserChange(appointmentBlock, request);
    List<CreateAppointmentBlockData> appointmentBlocks =
        createAppointmentBlockData(appointmentBlock);

    checkForCalendarConflicts(userChange.usersToAdd, appointmentBlocks);

    calendarClient.updateEventInCalendarIfExists(
        appointmentBlock, request, userChange.usersToRemove, userChange.usersToAdd);

    appointmentBlock.setAppointmentBlockStart(request.start());
    appointmentBlock.setAppointmentBlockEnd(request.end());
    appointmentBlock.setParallelExaminations(request.parallelExaminations());
    appointmentBlock.setPhysicians(request.physicians());
    appointmentBlock.setMfas(request.mfas());
    appointmentBlock.setConsultants(request.consultants());
    appointmentBlock.setRoom(request.room() != null ? request.room().trim() : null);
  }

  public ValidateAppointmentBlockGroupResponse validateUpdateAppointmentBlock(
      AppointmentBlock appointmentBlock, UpdateAppointmentBlockRequest request) {
    UserChange userChange = getUserChange(appointmentBlock, request);
    List<CreateAppointmentBlockData> appointmentBlocks =
        createAppointmentBlockData(appointmentBlock);

    List<UUID> userIdsWithEventConflicts =
        userChange.usersToAdd.isEmpty()
            ? List.of()
            : calendarClient.getUserIdsWithEventConflicts(userChange.usersToAdd, appointmentBlocks);
    List<UUID> userIdsWithoutEventConflicts = new ArrayList<>(userChange.newUsers);
    userIdsWithoutEventConflicts.removeAll(userIdsWithEventConflicts);
    return new ValidateAppointmentBlockGroupResponse(
        userIdsWithEventConflicts, userIdsWithoutEventConflicts);
  }

  private UserChange getUserChange(
      AppointmentBlock appointmentBlock, UpdateAppointmentBlockRequest request) {
    appointmentBlockValidator.validateTechnicalGroups(
        CollectionUtils.difference(request.physicians(), appointmentBlock.getPhysicians()),
        CollectionUtils.difference(request.mfas(), appointmentBlock.getMfas()),
        CollectionUtils.difference(request.consultants(), appointmentBlock.getConsultants()));

    List<UUID> oldUsers =
        getUserIdsForEvent(
            appointmentBlock.getPhysicians(),
            appointmentBlock.getMfas(),
            appointmentBlock.getConsultants(),
            appointmentBlock.getAppointmentBlockGroup().getCreatorId(),
            appointmentBlock.getCalendarEventId());

    List<UUID> newUsers =
        getUserIdsForEvent(
            request.physicians(),
            request.mfas(),
            request.consultants(),
            appointmentBlock.getAppointmentBlockGroup().getCreatorId());

    return new UserChange(
        CollectionUtils.difference(oldUsers, newUsers),
        CollectionUtils.difference(newUsers, oldUsers),
        newUsers);
  }

  private List<CreateAppointmentBlockData> createAppointmentBlockData(AppointmentBlock block) {
    return List.of(
        new CreateAppointmentBlockData(
            block.getAppointmentBlockStart(), block.getAppointmentBlockEnd()));
  }

  private record UserChange(List<UUID> usersToRemove, List<UUID> usersToAdd, List<UUID> newUsers) {}
}

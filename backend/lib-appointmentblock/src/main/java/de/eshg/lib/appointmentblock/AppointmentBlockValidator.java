/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import static java.time.temporal.ChronoUnit.DAYS;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.contact.api.InstitutionContactCategoryDto;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.appointmentblock.api.CreateDailyAppointmentBlockDto;
import de.eshg.lib.appointmentblock.api.CreateDailyAppointmentBlockGroupRequest;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockConfig;
import de.eshg.lib.contact.ContactClient;
import de.eshg.lib.keycloak.TechnicalGroup;
import de.eshg.rest.service.error.BadRequestException;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
public class AppointmentBlockValidator {

  public static final String TECHNICAL_GROUP_PHYSICIANS = "technicalGroupPhysicians";
  public static final String TECHNICAL_GROUP_MFAS = "technicalGroupMfas";
  public static final String TECHNICAL_GROUP_CONSULTANTS = "technicalGroupConsultants";

  private final AppointmentBlockConfig appointmentBlockConfig;
  private final UserApi userApi;
  private final ContactClient contactClient;
  private final Clock clock;

  private final Optional<TechnicalGroup> groupPhysicians;
  private final Optional<TechnicalGroup> groupMfas;
  private final Optional<TechnicalGroup> groupConsultants;

  public AppointmentBlockValidator(
      AppointmentBlockConfig appointmentBlockConfig,
      UserApi userApi,
      ContactClient contactClient,
      Clock clock,
      @Qualifier(TECHNICAL_GROUP_PHYSICIANS) Optional<TechnicalGroup> groupPhysicians,
      @Qualifier(TECHNICAL_GROUP_MFAS) Optional<TechnicalGroup> groupMfas,
      @Qualifier(TECHNICAL_GROUP_CONSULTANTS) Optional<TechnicalGroup> groupConsultants) {
    this.appointmentBlockConfig = appointmentBlockConfig;
    this.userApi = userApi;
    this.contactClient = contactClient;
    this.clock = clock;
    this.groupPhysicians = groupPhysicians;
    this.groupMfas = groupMfas;
    this.groupConsultants = groupConsultants;
  }

  void validateNumberOfAppointmentBlocks(CreateDailyAppointmentBlockGroupRequest request) {
    if (request.appointmentBlocks().size() > 5) {
      throw new BadRequestException("Number of AppointmentBlocks must be at most 5. ");
    }
  }

  void validateStartAndEndIsSameDayForAdHocAppointments(Instant start, Instant end) {
    LocalDate startDate = start.atZone(clock.getZone()).toLocalDate();
    LocalDate endDate = end.atZone(clock.getZone()).toLocalDate();
    if (!startDate.isEqual(endDate)) {
      throw new BadRequestException("Ad-hoc appointments do not span days!");
    }
  }

  void validateAdHocAppointmentDuration(Duration duration, Instant start, Instant end) {
    if (!end.equals(start.plus(duration))) {
      throw new BadRequestException(
          "Ad-hoc appointment duration must match the standard duration of the appointment type");
    }
  }

  void validateStartAndEndTimes(
      List<CreateDailyAppointmentBlockDto> dailyAppointmentBlocks,
      Duration minimalDurationForBlock) {
    for (CreateDailyAppointmentBlockDto appointmentBlock : dailyAppointmentBlocks) {
      Instant start = appointmentBlock.start();
      Instant end = appointmentBlock.end();
      if (end.isBefore(start)) {
        throw new BadRequestException(
            "AppointmentBlockGroup start date must be before or equal to end date.");
      }
      if (DAYS.between(start, end) > 31) {
        throw new BadRequestException("One AppointmentBlock may span at most 31 days.");
      }
      LocalTime startTime = start.atZone(clock.getZone()).toLocalTime();
      LocalTime endTime = end.atZone(clock.getZone()).toLocalTime();
      if (endTime.isBefore(startTime)) {
        throw new BadRequestException(
            "AppointmentBlockGroup end time of day must be after start time of day.");
      }
      Duration appointmentBlockLength = Duration.between(startTime, endTime);
      if (appointmentBlockLength.compareTo(minimalDurationForBlock) < 0) {
        throw new BadRequestException(
            "AppointmentBlockLength must be at least %s".formatted(minimalDurationForBlock));
      }
    }
  }

  void validateTechnicalGroups(List<UUID> physicians, List<UUID> mfas, List<UUID> consultants) {
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
            .collect(StreamUtil.toLinkedHashSet());
    if (!groupUserIds.containsAll(userIds)) {
      throw new BadRequestException("Not all userIds belong to the correct technical group.");
    }
  }

  void validateLocation(UUID locationId) {
    LocationSelectionMode locationSelectionMode = appointmentBlockConfig.getLocationSelectionMode();

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
}

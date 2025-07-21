/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import static de.eshg.lib.appointmentblock.AppointmentTypeMapper.mapUUIDToAppointmentType;

import de.eshg.lib.appointmentblock.api.AppointmentTypeConfigDto;
import de.eshg.lib.appointmentblock.api.GetAppointmentTypesResponse;
import de.eshg.lib.appointmentblock.api.UpdateAppointmentTypeRequest;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import java.time.Duration;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;

/** This service should be removed when the {@link AppointmentTypeController} is deleted. */
@Service
public class AppointmentTypeService {
  private final AbstractAppointmentStandardDurationService<?> appointmentStandardDurationService;

  private static final Comparator<AppointmentTypeConfigDto> appointmentTypeDtoComparator =
      Comparator.comparing(atd -> atd.appointmentTypeDto().name());

  public AppointmentTypeService(
      AbstractAppointmentStandardDurationService<?> appointmentStandardDurationService) {
    this.appointmentStandardDurationService = appointmentStandardDurationService;
  }

  public GetAppointmentTypesResponse getAppointmentTypes() {

    Map<AppointmentType, Duration> standardDurationsMap =
        appointmentStandardDurationService.getStandardDurations();

    List<AppointmentTypeConfigDto> appointmentTypeConfigDtoList =
        standardDurationsMap.entrySet().stream()
            .map(entry -> AppointmentTypeMapper.toInterfaceType(entry.getKey(), entry.getValue()))
            .sorted(appointmentTypeDtoComparator)
            .toList();

    return new GetAppointmentTypesResponse(appointmentTypeConfigDtoList);
  }

  public AppointmentTypeConfigDto getOneAppointmentType(UUID id) {
    AppointmentType appointmentType = mapUUIDToAppointmentType(id);
    return AppointmentTypeMapper.toInterfaceType(
        id,
        appointmentType,
        appointmentStandardDurationService.getStandardDuration(appointmentType).toMinutes());
  }

  public AppointmentTypeConfigDto updateAppointmentType(
      UUID id, UpdateAppointmentTypeRequest request) {
    AppointmentType appointmentType = mapUUIDToAppointmentType(id);
    appointmentStandardDurationService.updateStandardDuration(
        appointmentType, Duration.ofMinutes(request.standardDurationInMinutes()));
    return AppointmentTypeMapper.toInterfaceType(
        id, appointmentType, request.standardDurationInMinutes());
  }
}

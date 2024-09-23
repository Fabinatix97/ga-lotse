/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.eshg.lib.appointmentblock.api.AppointmentTypeConfigDto;
import de.eshg.lib.appointmentblock.api.GetAppointmentTypesResponse;
import de.eshg.lib.appointmentblock.api.UpdateAppointmentTypeRequest;
import de.eshg.lib.appointmentblock.persistence.AppointmentTypeRepository;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentTypeConfig;
import de.eshg.rest.service.error.NotFoundException;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class AppointmentTypeService {
  private final AppointmentTypeRepository appointmentTypeRepository;

  private static final Comparator<AppointmentTypeConfigDto> appointmentTypeDtoComparator =
      Comparator.comparing(atd -> atd.appointmentTypeDto().name());

  public AppointmentTypeService(AppointmentTypeRepository appointmentTypeRepository) {
    this.appointmentTypeRepository = appointmentTypeRepository;
  }

  public GetAppointmentTypesResponse getAppointmentTypes() {

    // pass the templates found for each appointmentType to the mapping conversion
    List<AppointmentTypeConfigDto> appointmentTypeConfigDtoList =
        appointmentTypeRepository.findAll().stream()
            .map(AppointmentTypeMapper::toInterfaceType)
            .sorted(appointmentTypeDtoComparator)
            .toList();
    return new GetAppointmentTypesResponse(appointmentTypeConfigDtoList);
  }

  public AppointmentTypeConfigDto getOneAppointmentType(UUID id) {
    AppointmentTypeConfig appointmentTypeConfig =
        appointmentTypeRepository
            .findById(id)
            .orElseThrow(() -> new NotFoundException("Appointment type not found"));

    return AppointmentTypeMapper.toInterfaceType(appointmentTypeConfig);
  }

  public AppointmentTypeConfigDto updateAppointmentType(
      UUID id, UpdateAppointmentTypeRequest request) {

    AppointmentTypeConfig appointmentTypeConfig =
        appointmentTypeRepository
            .findById(id)
            .orElseThrow(() -> new NotFoundException("Appointment type not found: " + id));
    appointmentTypeConfig.setStandardDurationInMinutes(request.standardDurationInMinutes());
    appointmentTypeRepository.save(appointmentTypeConfig);

    return AppointmentTypeMapper.toInterfaceType(appointmentTypeConfig);
  }
}

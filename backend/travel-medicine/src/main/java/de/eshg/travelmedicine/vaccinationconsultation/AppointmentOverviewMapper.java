/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.travelmedicine.util.MappingUtil;
import de.eshg.travelmedicine.vaccinationconsultation.api.AppointmentOverviewEntryDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.CreatedByUserTypeDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatientDto;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.AppointmentOverviewEntry;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class AppointmentOverviewMapper {

  private final Clock clock;

  public AppointmentOverviewMapper(Clock clock) {
    this.clock = clock;
  }

  public List<AppointmentOverviewEntryDto> toInterfaceType(
      List<AppointmentOverviewEntry> appointmentOverview,
      Map<UUID, PatientDto> personsFromCentralFile) {
    return appointmentOverview.stream()
        .map(
            entry -> toInterfaceType(entry, personsFromCentralFile.get(entry.centralFileStateId())))
        .sorted(
            Comparator.comparing(
                    AppointmentOverviewEntryDto::appointment,
                    Comparator.nullsFirst(Comparator.naturalOrder()))
                .thenComparing(
                    AppointmentOverviewEntryDto::lastName,
                    Comparator.nullsFirst(Comparator.naturalOrder())))
        .toList();
  }

  public AppointmentOverviewEntryDto toInterfaceType(
      AppointmentOverviewEntry aoEntry, PatientDto patient) {
    CreatedByUserTypeDto createdByUserType =
        MappingUtil.mapEnum(CreatedByUserTypeDto.class, aoEntry.createdBy());
    ProcedureStatusDto statusDto = MappingUtil.mapEnum(ProcedureStatusDto.class, aoEntry.status());
    AppointmentTypeDto appointmentTypeDto =
        MappingUtil.mapEnum(AppointmentTypeDto.class, aoEntry.appointmentType());
    Instant appointment;
    if (aoEntry.userDefinedAppointment() != null) {
      appointment = aoEntry.userDefinedAppointment();
    } else {
      appointment = aoEntry.appointmentBlockAppointment();
    }
    int age = Period.between(patient.dateOfBirth(), LocalDate.now(clock)).getYears();
    return new AppointmentOverviewEntryDto(
        aoEntry.procedureId(),
        patient.lastName(),
        patient.firstName(),
        patient.dateOfBirth(),
        age,
        aoEntry.travelStartDate(),
        createdByUserType,
        statusDto,
        appointment,
        appointmentTypeDto);
  }
}

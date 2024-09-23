/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import de.eshg.base.CountryCodeDto;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record PostVaccinationConsultationRequest(
    @NotNull @Valid PatientDto patient,
    @NotNull TravelTypeDto travelType,
    @NotNull List<@NotNull CountryCodeDto> travelDestinations,
    LocalDate travelStartDate,
    Integer travelTimeAmount,
    TravelTimeUnitDto travelTimeUnit,
    @NotNull AppointmentTypeDto initialStepAppointmentType,
    @NotNull AppointmentBookingTypeDto appointmentBookingType,
    Instant appointmentStart,
    @PositiveOrZero Integer durationInMinutes,
    LocalDate earliestDate) {}

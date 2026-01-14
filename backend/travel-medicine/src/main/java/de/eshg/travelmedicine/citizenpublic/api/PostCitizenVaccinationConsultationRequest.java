/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.citizenpublic.api;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatientDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.TravelInformationDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.Instant;

public record PostCitizenVaccinationConsultationRequest(
    @NotNull @Valid PatientDto patient,
    @NotNull @Valid TravelInformationDto travelInformation,
    @NotNull AppointmentTypeDto initialStepAppointmentType,
    @NotNull @Future Instant appointmentStart,
    @NotNull @Positive Integer durationInMinutes) {}

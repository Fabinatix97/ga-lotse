/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record GetVaccinationConsultationDetailsResponse(
    @NotNull UUID procedureId,
    @NotNull ProcedureStatusDto status,
    @NotNull @Valid PatientDto patient,
    @NotNull @Valid PersonSyncDto personSync,
    @NotNull @Valid TravelInformationDto travelInformation,
    @NotNull CreatedByUserTypeDto createdByUserType,
    @NotNull @Valid AppointmentSummaryDto initialAppointment,
    @NotNull @Valid List<ServicePlanEntryDto> servicePlanList) {}

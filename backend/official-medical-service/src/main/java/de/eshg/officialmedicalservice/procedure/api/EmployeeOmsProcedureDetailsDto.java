/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.api;

import de.eshg.base.user.api.UserDto;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.officialmedicalservice.appointment.api.OmsAppointmentDto;
import de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@Schema(name = "EmployeeOmsProcedureDetails")
public record EmployeeOmsProcedureDetailsDto(
    @NotNull UUID id,
    @NotNull ProcedureStatusDto status,
    @NotNull MedicalOpinionStatusDto medicalOpinionStatus,
    MedicalOpinionResultDto medicalOpinionResult,
    String medicalOpinionComment,
    @NotNull @Valid WaitingRoomDto waitingRoom,
    @NotNull @Valid AffectedPersonDto affectedPerson,
    @Valid FacilityDto facility,
    @Valid ConcernDto concern,
    @Valid UserDto physician,
    @NotNull @Valid List<OmsAppointmentDto> appointments,
    @NotNull boolean sendEmailNotifications,
    UUID citizenUserId) {}

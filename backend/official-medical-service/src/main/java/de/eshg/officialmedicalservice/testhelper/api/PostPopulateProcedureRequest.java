/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.officialmedicalservice.procedure.api.MedicalOpinionStatusDto;
import de.eshg.officialmedicalservice.procedure.api.PostEmployeeOmsProcedureFacilityRequest;
import de.eshg.officialmedicalservice.procedure.api.PostEmployeeOmsProcedureRequest;
import de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomDto;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

public record PostPopulateProcedureRequest(
    @Valid PostEmployeeOmsProcedureRequest procedureData,
    @Valid PostPopulateCitizenProcedureRequest procedureDataCitizen,
    @Valid PostEmployeeOmsProcedureFacilityRequest facility,
    ConcernTestDataConfig concern,
    UUID physician,
    @Valid List<@Valid AppointmentPopulationDto> appointments,
    List<String> cancelledAppointments,
    List<String> closedAppointments,
    @Valid List<DocumentPopulationDto> documents,
    MedicalOpinionStatusDto medicalOpinionStatus,
    ProcedureStatusDto targetState,
    Boolean sendEmailNotifications,
    @Valid WaitingRoomDto waitingRoom,
    String citizenUserId) {}

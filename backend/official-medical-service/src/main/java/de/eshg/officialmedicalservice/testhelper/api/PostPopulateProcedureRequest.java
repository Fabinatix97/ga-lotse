/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto;
import de.eshg.officialmedicalservice.procedure.api.MedicalOpinionResultDto;
import de.eshg.officialmedicalservice.procedure.api.MedicalOpinionStatusDto;
import de.eshg.officialmedicalservice.procedure.api.PostEmployeeOmsProcedureFacilityRequest;
import de.eshg.officialmedicalservice.procedure.api.PostEmployeeOmsProcedureRequest;
import de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomDto;
import jakarta.validation.Valid;
import java.time.LocalDate;
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
    List<String> submittedDocuments,
    List<String> rejectedDocuments,
    List<String> acceptedDocuments,
    MedicalOpinionStatusDto medicalOpinionStatus,
    MedicalOpinionResultDto medicalOpinionResult,
    String medicalOpinionComment,
    ProcedureStatusDto targetState,
    Boolean sendEmailNotifications,
    @Valid WaitingRoomDto waitingRoom,
    LocalDate cutOffDate,
    String citizenUserId,
    @Valid AnamnesisDto anamnesis,
    Boolean personAccepted) {}

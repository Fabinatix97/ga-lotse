/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.officialmedicalservice.procedure.api.PostEmployeeOmsProcedureFacilityRequest;
import de.eshg.officialmedicalservice.procedure.api.PostEmployeeOmsProcedureRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record PostPopulateProcedureRequest(
    @NotNull @Valid PostEmployeeOmsProcedureRequest procedureData,
    @Valid PostEmployeeOmsProcedureFacilityRequest facility,
    ConcernTestDataConfig concern,
    UUID physician,
    @Valid List<@Valid AppointmentPopulationDto> appointments,
    List<String> cancelledAppointments,
    List<String> closedAppointments,
    ProcedureStatusDto targetState) {}

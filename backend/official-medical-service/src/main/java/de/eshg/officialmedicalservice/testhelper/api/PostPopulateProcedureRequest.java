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

public record PostPopulateProcedureRequest(
    @NotNull @Valid PostEmployeeOmsProcedureRequest procedureData,
    @Valid PostEmployeeOmsProcedureFacilityRequest facility,
    ProcedureStatusDto targetState) {}

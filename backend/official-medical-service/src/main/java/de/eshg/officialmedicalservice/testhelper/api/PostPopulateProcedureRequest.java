/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper.api;

import de.eshg.officialmedicalservice.procedure.api.PostEmployeeOmsProcedureRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record PostPopulateProcedureRequest(
    @NotNull @Valid PostEmployeeOmsProcedureRequest procedureData) {}

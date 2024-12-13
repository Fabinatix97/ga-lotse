/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "PostEmployeeOmsProcedureRequest")
@Valid
public record PostEmployeeOmsProcedureRequest(@NotNull @Valid AffectedPersonDto affectedPerson) {}

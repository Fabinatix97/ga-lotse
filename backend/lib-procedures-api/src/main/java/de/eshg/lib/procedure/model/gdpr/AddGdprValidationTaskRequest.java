/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model.gdpr;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

public record AddGdprValidationTaskRequest(
    @NotNull UUID gdprProcedureId,
    @NotNull GdprValidationTaskTypeDto type,
    @NotNull Instant startedAt) {}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record AddGdprProcedureRequest(
    @NotNull GdprProcedureTypeDto type,
    @Valid @NotNull GdprIdentificationDataDto identificationData) {}

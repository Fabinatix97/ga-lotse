/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record UpdateExaminationsInBulkRequest(
    @NotNull UUID id, @NotNull long version, String note, @Valid ExaminationResultDto result) {}

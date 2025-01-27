/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record UpdateExaminationsInBulkRequest(
    @NotNull UUID id, @NotNull long version, String note, @Valid ExaminationResultDto result) {}

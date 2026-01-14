/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@Schema(name = "ProphylaxisSessionExaminationUpdateResult")
public record ProphylaxisSessionExaminationUpdateResultDto(
    @NotNull List<UUID> failedPersonUpdates,
    @NotNull List<UUID> failedExaminationUpdates,
    @NotNull @Valid ProphylaxisSessionDetailsDto prophylaxisSessionDetails) {}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.polytune;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record PolytuneScheduleMeaslesVaccinationCheckRequest(
    @NotNull UUID requestId, @NotNull List<UUID> fileStateIds) {}

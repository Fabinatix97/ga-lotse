/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.vaccination;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record VaccinationCheckRequest(@NotNull List<UUID> fileStateIds) {}

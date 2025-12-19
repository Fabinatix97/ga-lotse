/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetInstitutionGroupsResponse(@NotNull List<String> groups) {}

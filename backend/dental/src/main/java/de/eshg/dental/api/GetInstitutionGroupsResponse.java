/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetInstitutionGroupsResponse(@NotNull List<String> groups) {}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

public record SearchStreetResponse(@Valid @NotNull Set<DistrictDto> cityDistricts) {}

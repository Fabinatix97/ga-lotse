/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import jakarta.validation.constraints.NotNull;

public record FacilityPartialMatchAttributes(
    @NotNull String name, FacilityAddressPartialMatchAttributes addressPartialMatchAttributes) {}

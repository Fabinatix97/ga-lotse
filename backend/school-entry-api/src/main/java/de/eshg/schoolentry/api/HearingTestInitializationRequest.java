/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import de.eshg.validation.constraints.FourCharCode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record HearingTestInitializationRequest(
    @NotNull long version, @NotBlank @FourCharCode String equipmentSelector) {}

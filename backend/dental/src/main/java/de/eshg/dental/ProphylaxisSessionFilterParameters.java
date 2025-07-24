/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import de.eshg.dental.api.ProphylaxisStatusDto;
import de.eshg.dental.api.ProphylaxisTypeDto;
import jakarta.validation.constraints.Min;
import java.util.UUID;

public record ProphylaxisSessionFilterParameters(
    UUID institutionIdFilter,
    @Min(1) Integer yearFilter,
    ProphylaxisTypeDto typeFilter,
    ProphylaxisStatusDto statusFilter) {}

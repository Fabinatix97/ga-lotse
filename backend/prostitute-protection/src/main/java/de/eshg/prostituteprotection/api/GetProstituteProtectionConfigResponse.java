/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import de.eshg.prostituteprotection.ProstituteProtectionConfigDto;
import jakarta.validation.Valid;

public record GetProstituteProtectionConfigResponse(
    @Valid ProstituteProtectionConfigDto protectionConfig) {}

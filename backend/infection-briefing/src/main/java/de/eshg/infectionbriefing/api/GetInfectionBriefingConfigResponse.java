/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import de.eshg.infectionbriefing.InfectionBriefingConfigDto;
import jakarta.validation.Valid;

public record GetInfectionBriefingConfigResponse(
    @Valid InfectionBriefingConfigDto infectionBriefingConfig) {}

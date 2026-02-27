/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import de.eshg.config.api.MultiLangDocumentDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "InfectionBriefingConfig")
public record InfectionBriefingConfigDto(@NotNull @Valid MultiLangDocumentDto landingPageContent) {}

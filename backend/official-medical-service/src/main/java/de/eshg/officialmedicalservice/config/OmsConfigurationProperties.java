/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties("de.eshg.de.eshg.official-medical-service.validation")
public record OmsConfigurationProperties(
    @DefaultValue("204800") long maxMarkdownFileSizeBytes,
    @DefaultValue("204800") long maxYamlFileSizeBytes,
    @DefaultValue("5") int concernsMaxCategories,
    @DefaultValue("50") int concernsMaxConcernsPerCategory) {}

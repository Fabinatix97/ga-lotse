/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import jakarta.validation.constraints.NotEmpty;
import org.hibernate.validator.constraints.URL;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties("de.eshg.base")
public record BaseConfigurationProperties(
    @DefaultValue("204800") long maxMarkdownFileSizeBytes,
    @DefaultValue("500000") long maxLogoSvgFileSizeBytes,
    @DefaultValue("2097152") long maxCsvFileSizeBytes,
    @NotEmpty @URL String svgSanitizerBaseUrl,
    @DefaultValue("true") boolean isOpenDataEnabled) {}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.config;

import de.eshg.testhelper.FeatureToggle;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.opendata.feature-toggle", ignoreUnknownFields = false)
public class OpenDataFeatureToggle extends FeatureToggle<OpenDataFeature> {}

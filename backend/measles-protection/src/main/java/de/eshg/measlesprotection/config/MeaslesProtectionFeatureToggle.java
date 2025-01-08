/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.config;

import de.eshg.testhelper.FeatureToggle;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(
    prefix = "de.eshg.measlesprotection.feature-toggle",
    ignoreUnknownFields = false)
public class MeaslesProtectionFeatureToggle extends FeatureToggle<MeaslesProtectionFeature> {}

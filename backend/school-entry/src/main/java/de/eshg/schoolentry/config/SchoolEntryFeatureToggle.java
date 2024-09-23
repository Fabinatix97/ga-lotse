/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.config;

import de.eshg.testhelper.FeatureToggle;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.schoolentry.feature-toggle", ignoreUnknownFields = false)
public class SchoolEntryFeatureToggle extends FeatureToggle<SchoolEntryFeature> {}

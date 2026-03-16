/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.feature;

import de.eshg.testhelper.FeatureToggle;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(
    prefix = "de.eshg.officialmedicalservice.feature-toggle",
    ignoreUnknownFields = false)
public class OmsFeatureToggle extends FeatureToggle<OmsFeature> {}

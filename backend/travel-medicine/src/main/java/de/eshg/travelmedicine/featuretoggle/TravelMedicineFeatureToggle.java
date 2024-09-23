/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.featuretoggle;

import de.eshg.testhelper.FeatureToggle;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(
    prefix = "de.eshg.travelmedicine.feature-toggle",
    ignoreUnknownFields = false)
public class TravelMedicineFeatureToggle extends FeatureToggle<TravelMedicineFeature> {}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.featuretoggle;

import de.eshg.testhelper.FeatureToggle;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(
    prefix = "de.eshg.medicalregistry.feature-toggle",
    ignoreUnknownFields = false)
public class MedicalRegistryFeatureToggle extends FeatureToggle<MedicalRegistryFeature> {}

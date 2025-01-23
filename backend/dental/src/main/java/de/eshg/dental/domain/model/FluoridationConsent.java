/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.time.LocalDate;

@Embeddable
@DataSensitivity(SensitivityLevel.SENSITIVE)
public record FluoridationConsent(
    @Column(nullable = false) LocalDate dateOfConsent,
    @Column(nullable = false) boolean consented,
    Boolean hasAllergy) {}

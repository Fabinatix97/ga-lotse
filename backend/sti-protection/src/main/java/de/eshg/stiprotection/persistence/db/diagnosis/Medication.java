/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.diagnosis;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.time.LocalDate;

@Embeddable
@DataSensitivity(SensitivityLevel.SENSITIVE)
public record Medication(
    @Column(nullable = false) String name,
    @Column(nullable = false) String dose,
    @Column(nullable = false) LocalDate prescriptionDate) {}

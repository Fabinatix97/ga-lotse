/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.diagnosis;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.time.LocalDate;

@Embeddable
public record Medication(
    @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE) @Column(nullable = false) String name,
    @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE) @Column(nullable = false) String dose,
    @DataSensitivity(SensitivityLevel.SENSITIVE) @Column(nullable = false)
        LocalDate prescriptionDate) {}

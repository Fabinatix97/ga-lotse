/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.medicalhistory;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
@DiscriminatorValue(value = "HIV_STI_CONSULTATION")
public class StiConsultationMedicalHistory extends MedicalHistory {}

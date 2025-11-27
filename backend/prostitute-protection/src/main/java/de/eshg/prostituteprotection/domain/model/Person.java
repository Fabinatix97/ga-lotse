/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
@Table(indexes = @Index(columnList = "procedure_id"))
public class Person extends RelatedPerson<ProstituteProtectionProcedure> {}

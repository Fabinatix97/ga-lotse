/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence.entity;

import de.eshg.lib.common.CountryCode;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.time.LocalDate;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Embeddable
public record BirthDetails(
    @Column(nullable = false) @DataSensitivity(SensitivityLevel.PROTECTED) LocalDate dateOfBirth,
    @DataSensitivity(SensitivityLevel.SENSITIVE) String nameAtBirth,
    @DataSensitivity(SensitivityLevel.SENSITIVE) String placeOfBirth,
    @JdbcType(PostgreSQLEnumJdbcType.class) @DataSensitivity(SensitivityLevel.SENSITIVE)
        CountryCode countryOfBirth) {
  public BirthDetails(LocalDate dateOfBirth) {
    this(dateOfBirth, null, null, null);
  }
}

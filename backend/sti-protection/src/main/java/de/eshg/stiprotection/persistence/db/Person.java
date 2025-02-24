/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db;

import de.eshg.lib.common.CountryCode;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.Year;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@Table(indexes = @Index(columnList = "procedure_id", unique = true))
public class Person extends RelatedPerson<StiProtectionProcedure> {

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.UNDEFINED)
  private Gender gender;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.UNDEFINED)
  private Year yearOfBirth;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.UNDEFINED)
  private CountryCode countryOfBirth;

  @DataSensitivity(SensitivityLevel.UNDEFINED)
  private Year inGermanySince;

  public Gender getGender() {
    return gender;
  }

  public void setGender(Gender gender) {
    this.gender = gender;
  }

  public Year getYearOfBirth() {
    return yearOfBirth;
  }

  public void setYearOfBirth(Year yearOfBirth) {
    this.yearOfBirth = yearOfBirth;
  }

  public CountryCode getCountryOfBirth() {
    return countryOfBirth;
  }

  public void setCountryOfBirth(CountryCode countryOfBirth) {
    this.countryOfBirth = countryOfBirth;
  }

  public Year getInGermanySince() {
    return inGermanySince;
  }

  public void setInGermanySince(Year inGermanySince) {
    this.inGermanySince = inGermanySince;
  }
}

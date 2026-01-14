/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db;

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
@Table(
    indexes = {
      @Index(columnList = "procedure_id", unique = true),
      @Index(columnList = "gender"),
      @Index(columnList = "yearOfBirth"),
    })
public class Person extends RelatedPerson<StiProtectionProcedure> {

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Gender gender;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Year yearOfBirth;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean hasSufficientGermanLanguageSkills;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String otherKnownLanguages;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String pronouns;

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

  public void copyFrom(Person source) {
    setGender(source.getGender());
    setYearOfBirth(source.getYearOfBirth());
    setPersonType(source.getPersonType());
    setCentralFileStateId(source.getCentralFileStateId());
    setHasSufficientGermanLanguageSkills(source.getHasSufficientGermanLanguageSkills());
    setOtherKnownLanguages(source.getOtherKnownLanguages());
    setPronouns(source.getPronouns());
  }

  public Boolean getHasSufficientGermanLanguageSkills() {
    return hasSufficientGermanLanguageSkills;
  }

  public void setHasSufficientGermanLanguageSkills(Boolean hasSufficientGermanLanguageSkills) {
    this.hasSufficientGermanLanguageSkills = hasSufficientGermanLanguageSkills;
  }

  public String getOtherKnownLanguages() {
    return otherKnownLanguages;
  }

  public void setOtherKnownLanguages(String otherKnownLanguages) {
    this.otherKnownLanguages = otherKnownLanguages;
  }

  public String getPronouns() {
    return pronouns;
  }

  public void setPronouns(String pronouns) {
    this.pronouns = pronouns;
  }
}

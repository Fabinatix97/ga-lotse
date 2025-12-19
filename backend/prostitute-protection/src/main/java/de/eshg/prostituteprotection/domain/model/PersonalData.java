/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.domain.model;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OrderColumn;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class PersonalData extends BaseEntity {

  private String alias;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private CountryCode nationality;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DocumentType documentType;

  @ElementCollection
  @Enumerated(EnumType.STRING)
  @OrderColumn
  private List<Language> languages = new ArrayList<>();

  public String getAlias() {
    return alias;
  }

  public void setAlias(String alias) {
    this.alias = alias;
  }

  public CountryCode getNationality() {
    return nationality;
  }

  public void setNationality(CountryCode nationality) {
    this.nationality = nationality;
  }

  public DocumentType getDocumentType() {
    return documentType;
  }

  public void setDocumentType(DocumentType documentType) {
    this.documentType = documentType;
  }

  public List<Language> getLanguages() {
    return languages;
  }

  public void setLanguages(List<Language> languages) {
    this.languages = languages;
  }
}

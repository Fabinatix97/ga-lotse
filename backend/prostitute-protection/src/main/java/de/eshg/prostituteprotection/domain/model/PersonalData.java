/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.domain.model;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OrderColumn;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class PersonalData extends BaseEntity {

  private String alias;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DocumentType documentType;

  @ElementCollection
  @Enumerated(EnumType.STRING)
  @OrderColumn
  private List<Language> languages = new ArrayList<>();

  private String phoneNumber;

  private LocalDate residencePermitValidityDate;

  private String customDocumentType;

  public LocalDate getResidencePermitValidityDate() {
    return residencePermitValidityDate;
  }

  public void setResidencePermitValidityDate(LocalDate residencePermitValidityDate) {
    this.residencePermitValidityDate = residencePermitValidityDate;
  }

  public String getCustomDocumentType() {
    return customDocumentType;
  }

  public void setCustomDocumentType(String customDocumentType) {
    this.customDocumentType = customDocumentType;
  }

  public String getAlias() {
    return alias;
  }

  public void setAlias(String alias) {
    this.alias = alias;
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

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }
}

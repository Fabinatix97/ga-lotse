/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.config.domain.Document;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class DepartmentConfiguration extends BaseEntity {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private Document logo;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private Document streetDirectory;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private Document municipalityDirectory;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private MultiLangDocument citizenPortalAccessibilityStatementMarkdown;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private MultiLangDocument employeePortalAccessibilityStatementMarkdown;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private MultiLangDocument acknowledgementsMarkdown;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private MultiLangDocument contactMarkdown;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private MultiLangDocument imprintMarkdown;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private MultiLangDocument citizenPortalPrivacyPolicyMarkdown;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private MultiLangDocument employeePortalPrivacyPolicyMarkdown;

  public Document getLogo() {
    return logo;
  }

  public void setLogo(Document logo) {
    this.logo = logo;
  }

  public Document getStreetDirectory() {
    return streetDirectory;
  }

  public void setStreetDirectory(Document streetDirectory) {
    this.streetDirectory = streetDirectory;
  }

  public Document getMunicipalityDirectory() {
    return municipalityDirectory;
  }

  public void setMunicipalityDirectory(Document municipalityDirectory) {
    this.municipalityDirectory = municipalityDirectory;
  }

  public MultiLangDocument getCitizenPortalAccessibilityStatementMarkdown() {
    return citizenPortalAccessibilityStatementMarkdown;
  }

  public void setCitizenPortalAccessibilityStatementMarkdown(
      MultiLangDocument markdownCitizenAccessibility) {
    this.citizenPortalAccessibilityStatementMarkdown = markdownCitizenAccessibility;
  }

  public MultiLangDocument getImprintMarkdown() {
    return imprintMarkdown;
  }

  public void setImprintMarkdown(MultiLangDocument markdownCitizenImprint) {
    this.imprintMarkdown = markdownCitizenImprint;
  }

  public MultiLangDocument getCitizenPortalPrivacyPolicyMarkdown() {
    return citizenPortalPrivacyPolicyMarkdown;
  }

  public void setCitizenPortalPrivacyPolicyMarkdown(MultiLangDocument markdownCitizenPrivacy) {
    this.citizenPortalPrivacyPolicyMarkdown = markdownCitizenPrivacy;
  }

  public MultiLangDocument getAcknowledgementsMarkdown() {
    return acknowledgementsMarkdown;
  }

  public void setAcknowledgementsMarkdown(MultiLangDocument markdownCommonAcknowledgements) {
    this.acknowledgementsMarkdown = markdownCommonAcknowledgements;
  }

  public MultiLangDocument getEmployeePortalAccessibilityStatementMarkdown() {
    return employeePortalAccessibilityStatementMarkdown;
  }

  public void setEmployeePortalAccessibilityStatementMarkdown(
      MultiLangDocument markdownEmployeeAccessibility) {
    this.employeePortalAccessibilityStatementMarkdown = markdownEmployeeAccessibility;
  }

  public MultiLangDocument getContactMarkdown() {
    return contactMarkdown;
  }

  public void setContactMarkdown(MultiLangDocument markdownEmployeeContact) {
    this.contactMarkdown = markdownEmployeeContact;
  }

  public MultiLangDocument getEmployeePortalPrivacyPolicyMarkdown() {
    return employeePortalPrivacyPolicyMarkdown;
  }

  public void setEmployeePortalPrivacyPolicyMarkdown(MultiLangDocument markdownEmployeePrivacy) {
    this.employeePortalPrivacyPolicyMarkdown = markdownEmployeePrivacy;
  }
}

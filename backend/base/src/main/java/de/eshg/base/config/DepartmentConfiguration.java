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
  private boolean logoInitialized = false;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean streetAndMunicipalityDirectoriesInitialized = false;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY, orphanRemoval = true)
  @JoinColumn(nullable = false)
  private Document streetDirectory;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY, orphanRemoval = true)
  @JoinColumn(nullable = false)
  private Document municipalityDirectory;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean accessibilityStatementMarkdownsInitialized = false;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY, orphanRemoval = true)
  @JoinColumn(nullable = false)
  private MultiLangDocument citizenPortalAccessibilityStatementMarkdown;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY, orphanRemoval = true)
  @JoinColumn(nullable = false)
  private MultiLangDocument employeePortalAccessibilityStatementMarkdown;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean acknowledgementsMarkdownsInitialized = false;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY, orphanRemoval = true)
  @JoinColumn(nullable = false)
  private MultiLangDocument acknowledgementsMarkdown;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean contactMarkdownsInitialized = false;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY, orphanRemoval = true)
  @JoinColumn(nullable = false)
  private MultiLangDocument contactMarkdown;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean imprintMarkdownsInitialized = false;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY, orphanRemoval = true)
  @JoinColumn(nullable = false)
  private MultiLangDocument imprintMarkdown;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean privacyPolicyMarkdownsInitialized = false;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY, orphanRemoval = true)
  @JoinColumn(nullable = false)
  private MultiLangDocument citizenPortalPrivacyPolicyMarkdown;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY, orphanRemoval = true)
  @JoinColumn(nullable = false)
  private MultiLangDocument employeePortalPrivacyPolicyMarkdown;

  public Document getLogo() {
    return logo;
  }

  public void setLogo(Document logo) {
    this.logo = logo;
  }

  public boolean isLogoInitialized() {
    return logoInitialized;
  }

  public void setLogoInitialized(boolean logoInitialized) {
    this.logoInitialized = logoInitialized;
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

  public boolean isStreetAndMunicipalityDirectoriesInitialized() {
    return streetAndMunicipalityDirectoriesInitialized;
  }

  public void setStreetAndMunicipalityDirectoriesInitialized(
      boolean streetAndMunicipalityDirectoriesInitialized) {
    this.streetAndMunicipalityDirectoriesInitialized = streetAndMunicipalityDirectoriesInitialized;
  }

  public boolean isAccessibilityStatementMarkdownsInitialized() {
    return accessibilityStatementMarkdownsInitialized;
  }

  public void setAccessibilityStatementMarkdownsInitialized(
      boolean accessibilityStatementMarkdownsInitialized) {
    this.accessibilityStatementMarkdownsInitialized = accessibilityStatementMarkdownsInitialized;
  }

  public boolean isAcknowledgementsMarkdownsInitialized() {
    return acknowledgementsMarkdownsInitialized;
  }

  public void setAcknowledgementsMarkdownsInitialized(
      boolean acknowledgementsMarkdownsInitialized) {
    this.acknowledgementsMarkdownsInitialized = acknowledgementsMarkdownsInitialized;
  }

  public boolean isContactMarkdownsInitialized() {
    return contactMarkdownsInitialized;
  }

  public void setContactMarkdownsInitialized(boolean contactMarkdownsInitialized) {
    this.contactMarkdownsInitialized = contactMarkdownsInitialized;
  }

  public boolean isImprintMarkdownsInitialized() {
    return imprintMarkdownsInitialized;
  }

  public void setImprintMarkdownsInitialized(boolean imprintMarkdownsInitialized) {
    this.imprintMarkdownsInitialized = imprintMarkdownsInitialized;
  }

  public boolean isPrivacyPolicyMarkdownsInitialized() {
    return privacyPolicyMarkdownsInitialized;
  }

  public void setPrivacyPolicyMarkdownsInitialized(boolean privacyPolicyMarkdownsInitialized) {
    this.privacyPolicyMarkdownsInitialized = privacyPolicyMarkdownsInitialized;
  }
}

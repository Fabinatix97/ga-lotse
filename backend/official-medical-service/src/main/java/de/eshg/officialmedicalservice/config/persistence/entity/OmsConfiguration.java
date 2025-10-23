/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.config.persistence.entity;

import de.eshg.config.domain.Document;
import de.eshg.config.domain.Initializable;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.officialmedicalservice.config.IOmsConfiguration;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotNull;

@Entity
public class OmsConfiguration extends BaseEntity implements Initializable, IOmsConfiguration {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean initialized = false;

  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.EAGER)
  @JoinColumn(nullable = false)
  private Document concerns;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.EAGER)
  @JoinColumn(nullable = false)
  private MultiLangDocument landingContent;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.EAGER)
  private MultiLangDocument selectConcernInfobox;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private int keycloakUserCleanupJobOverdueDuration;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private int medicalOpinionCutOffDateLeadTime;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean citizenPortalAnamnesisEnabled;

  public Document getConcerns() {
    return concerns;
  }

  public void setConcerns(Document concerns) {
    this.concerns = concerns;
  }

  public MultiLangDocument getLandingContent() {
    return landingContent;
  }

  public void setLandingContent(MultiLangDocument landingContent) {
    this.landingContent = landingContent;
  }

  public MultiLangDocument getSelectConcernInfobox() {
    return selectConcernInfobox;
  }

  public void setSelectConcernInfobox(MultiLangDocument selectConcernInfobox) {
    this.selectConcernInfobox = selectConcernInfobox;
  }

  public int getKeycloakUserCleanupJobOverdueDuration() {
    return keycloakUserCleanupJobOverdueDuration;
  }

  public void setKeycloakUserCleanupJobOverdueDuration(int keycloakUserCleanupJobOverdueDuration) {
    this.keycloakUserCleanupJobOverdueDuration = keycloakUserCleanupJobOverdueDuration;
  }

  public int getMedicalOpinionCutOffDateLeadTime() {
    return medicalOpinionCutOffDateLeadTime;
  }

  public void setMedicalOpinionCutOffDateLeadTime(int medicalOpinionCutOffDateLeadTime) {
    this.medicalOpinionCutOffDateLeadTime = medicalOpinionCutOffDateLeadTime;
  }

  public boolean isCitizenPortalAnamnesisEnabled() {
    return citizenPortalAnamnesisEnabled;
  }

  public void setCitizenPortalAnamnesisEnabled(boolean citizenPortalAnamnesisEnabled) {
    this.citizenPortalAnamnesisEnabled = citizenPortalAnamnesisEnabled;
  }

  @Override
  public boolean isInitialized() {
    return initialized;
  }

  @Override
  public void setInitialized(boolean initialized) {
    this.initialized = initialized;
  }
}

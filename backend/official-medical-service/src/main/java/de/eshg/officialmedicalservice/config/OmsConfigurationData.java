/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.config;

import de.eshg.config.domain.Document;
import de.eshg.config.domain.MultiLangDocument;

public class OmsConfigurationData implements IOmsConfiguration {
  private final Document concerns;
  private final MultiLangDocument landingContent;
  private final MultiLangDocument selectConcernInfobox;
  private final int KeycloakUserCleanupJobOverdueDuration;
  private final int medicalOpinionCutOffDateLeadTime;
  private final boolean citizenPortalAnamnesisEnabled;

  public OmsConfigurationData(
      Document concerns,
      MultiLangDocument landingContent,
      MultiLangDocument selectConcernInfobox,
      int keycloakUserCleanupJobOverdueDuration,
      int medicalOpinionCutOffDateLeadTime,
      boolean citizenPortalAnamnesisEnabled) {
    this.concerns = concerns;
    this.landingContent = landingContent;
    this.selectConcernInfobox = selectConcernInfobox;
    KeycloakUserCleanupJobOverdueDuration = keycloakUserCleanupJobOverdueDuration;
    this.medicalOpinionCutOffDateLeadTime = medicalOpinionCutOffDateLeadTime;
    this.citizenPortalAnamnesisEnabled = citizenPortalAnamnesisEnabled;
  }

  @Override
  public Document getConcerns() {
    return concerns;
  }

  @Override
  public MultiLangDocument getLandingContent() {
    return landingContent;
  }

  public MultiLangDocument getSelectConcernInfobox() {
    return selectConcernInfobox;
  }

  @Override
  public int getKeycloakUserCleanupJobOverdueDuration() {
    return KeycloakUserCleanupJobOverdueDuration;
  }

  @Override
  public int getMedicalOpinionCutOffDateLeadTime() {
    return medicalOpinionCutOffDateLeadTime;
  }

  @Override
  public boolean isCitizenPortalAnamnesisEnabled() {
    return citizenPortalAnamnesisEnabled;
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.config;

import de.eshg.config.domain.Document;
import de.eshg.config.domain.MultiLangDocument;

public interface IOmsConfiguration {
  Document getConcerns();

  MultiLangDocument getLandingContent();

  MultiLangDocument getSelectConcernInfobox();

  int getKeycloakUserCleanupJobOverdueDuration();

  int getMedicalOpinionCutOffDateLeadTime();

  boolean isCitizenPortalAnamnesisEnabled();
}

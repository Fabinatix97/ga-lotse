/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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

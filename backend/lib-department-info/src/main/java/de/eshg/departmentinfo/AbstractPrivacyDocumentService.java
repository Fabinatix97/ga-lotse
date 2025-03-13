/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo;

import de.eshg.config.EshgConfigurationService;
import de.eshg.departmentinfo.domain.PrivacyDocuments;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

public abstract class AbstractPrivacyDocumentService
    extends EshgConfigurationService<PrivacyDocuments> {

  protected AbstractPrivacyDocumentService(
      EntityManager entityManager, TransactionHelper transactionHelper) {
    super(entityManager, transactionHelper, PrivacyDocuments.class);
  }

  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyNotice() {
    return PrivacyDocumentHelper.privacyNoticeAttachmentResponse(
        getConfig().getPrivacyNotice().getContent());
  }

  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyPolicy() {
    return PrivacyDocumentHelper.privacyPolicyAttachmentResponse(
        getConfig().getPrivacyPolicy().getContent());
  }
}

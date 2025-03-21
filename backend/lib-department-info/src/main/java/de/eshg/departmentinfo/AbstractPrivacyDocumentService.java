/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo;

import de.eshg.config.EshgConfigurationService;
import de.eshg.departmentinfo.domain.AbstractPrivacyDocumentsConfig;
import de.eshg.departmentinfo.domain.PrivacyDocument;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

public abstract class AbstractPrivacyDocumentService<T extends AbstractPrivacyDocumentsConfig>
    extends EshgConfigurationService<T> {

  protected AbstractPrivacyDocumentService(
      EntityManager entityManager, TransactionHelper transactionHelper, Class<T> configClass) {
    super(entityManager, transactionHelper, configClass);
  }

  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyNoticeDe() {
    return PrivacyDocumentHelper.privacyNoticeAttachmentResponse(
        getConfig().getPrivacyNotice().getDe().getContent());
  }

  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyPolicyDe() {
    return PrivacyDocumentHelper.privacyPolicyAttachmentResponse(
        getConfig().getPrivacyPolicy().getDe().getContent());
  }

  @Transactional(propagation = Propagation.REQUIRED)
  public void updatePrivacyPolicy(PrivacyDocument privacyPolicyUpdate) {
    T config = getConfig();
    config.setPrivacyPolicy(updatePrivacyDocument(config.getPrivacyPolicy(), privacyPolicyUpdate));
  }

  @Transactional(propagation = Propagation.REQUIRED)
  public void updatePrivacyNotice(PrivacyDocument privacyNoticeUpdate) {
    T config = getConfig();
    config.setPrivacyNotice(updatePrivacyDocument(config.getPrivacyNotice(), privacyNoticeUpdate));
  }

  protected PrivacyDocument updatePrivacyDocument(
      PrivacyDocument persistedDocument, PrivacyDocument documentUpdate) {
    persistedDocument.updateDe(documentUpdate.getDe());
    persistedDocument.updateEn(documentUpdate.getEn());
    return persistedDocument;
  }
}

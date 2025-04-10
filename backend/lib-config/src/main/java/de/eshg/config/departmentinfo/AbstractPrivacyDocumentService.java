/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.departmentinfo;

import de.eshg.base.util.MapUtils;
import de.eshg.config.ConfigurationEndpoint;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.config.domain.AbstractPrivacyDocumentsConfig;
import de.eshg.config.domain.PrivacyDocument;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import java.util.SequencedMap;
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

  @Override
  @Transactional(propagation = Propagation.REQUIRED)
  protected SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    T config = getConfig();
    return MapUtils.orderedMapOf(
        ConfigurationEndpoint.PRIVACY_POLICY.name(),
        toConfigurationStatus(config.getPrivacyPolicy()),
        ConfigurationEndpoint.PRIVACY_NOTICE.name(),
        toConfigurationStatus(config.getPrivacyPolicy()));
  }

  private ConfigurationStatus toConfigurationStatus(PrivacyDocument privacyPolicy) {
    if (privacyPolicy == null) {
      return ConfigurationStatus.COMPLETE;
    } else if (privacyPolicy.getEn() != null) {
      return ConfigurationStatus.COMPLETE;
    } else {
      return ConfigurationStatus.PARTIALLY_COMPLETE;
    }
  }
}

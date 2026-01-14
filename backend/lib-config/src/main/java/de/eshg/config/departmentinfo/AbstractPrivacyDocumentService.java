/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.departmentinfo;

import static de.eshg.config.departmentinfo.ConfigAuditLogMapper.getRelevantFieldsForLogging;

import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationEndpoint;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.config.domain.AbstractPrivacyDocumentsConfig;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.config.i18n.MultiLangDocumentHelper;
import de.eshg.config.i18n.MultiLangFileName;
import de.eshg.config.mapper.MultiLangDocumentMapper;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import java.util.SequencedMap;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

public abstract class AbstractPrivacyDocumentService<T extends AbstractPrivacyDocumentsConfig>
    extends EshgConfigurationService<T> {

  public static final MultiLangFileName PRIVACY_NOTICE_FILE_NAME =
      new MultiLangFileName("Datenschutz-Information.pdf", "privacy-notice.pdf");
  public static final MultiLangFileName PRIVACY_POLICY_FILE_NAME =
      new MultiLangFileName("Datenschutzerklaerung.pdf", "privacy-policy.pdf");
  public static final MultiLangFileName PRIVACY_NOTICE_CONFIG_FILENAME =
      MultiLangFileName.fromFilenameWithLanguageTags(PRIVACY_NOTICE_FILE_NAME.de());
  public static final MultiLangFileName PRIVACY_POLICY_CONFIG_FILENAME =
      MultiLangFileName.fromFilenameWithLanguageTags(PRIVACY_POLICY_FILE_NAME.de());

  protected final AuditLogWriter auditLogWriter;

  protected AbstractPrivacyDocumentService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      AuditLogWriter auditLogWriter,
      Class<T> configClass) {
    super(entityManager, transactionHelper, configClass);
    this.auditLogWriter = auditLogWriter;
  }

  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyNotice() {
    return MultiLangDocumentHelper.getAsPdfResponseByCurrentLanguageWithFallback(
        getConfig().getPrivacyNotice(), PRIVACY_NOTICE_FILE_NAME);
  }

  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyPolicy() {
    return MultiLangDocumentHelper.getAsPdfResponseByCurrentLanguageWithFallback(
        getConfig().getPrivacyPolicy(), PRIVACY_POLICY_FILE_NAME);
  }

  @Transactional(propagation = Propagation.REQUIRED)
  public T updatePrivacyPolicy(MultiLangDocument privacyPolicyUpdate) {
    T config = getConfig();
    config.setPrivacyPolicy(updatePrivacyDocument(config.getPrivacyPolicy(), privacyPolicyUpdate));
    return config;
  }

  @Transactional(propagation = Propagation.REQUIRED)
  public T updatePrivacyNotice(MultiLangDocument privacyNoticeUpdate) {
    T config = getConfig();
    config.setPrivacyNotice(updatePrivacyDocument(config.getPrivacyNotice(), privacyNoticeUpdate));
    return config;
  }

  protected MultiLangDocument updatePrivacyDocument(
      MultiLangDocument persistedDocument, MultiLangDocument documentUpdate) {
    auditLogWriter.writeChangeToAuditLog(
        "privacyDocumentsConfig",
        getRelevantFieldsForLogging(persistedDocument),
        getRelevantFieldsForLogging(documentUpdate));
    persistedDocument.updateDe(documentUpdate.getDe());
    persistedDocument.updateEn(documentUpdate.getEn());
    return persistedDocument;
  }

  @Override
  @Transactional(propagation = Propagation.REQUIRED)
  public SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    T config = getConfig();
    return MapUtils.orderedMapOf(
        ConfigurationEndpoint.PRIVACY_POLICY.name(),
        toConfigurationStatus(config.getPrivacyPolicy()),
        ConfigurationEndpoint.PRIVACY_NOTICE.name(),
        toConfigurationStatus(config.getPrivacyNotice()));
  }

  protected ConfigurationStatus toConfigurationStatus(MultiLangDocument multiLangDocument) {
    if (multiLangDocument == null) {
      return ConfigurationStatus.COMPLETE;
    } else {
      return MultiLangDocumentMapper.mapToConfigurationStatus(multiLangDocument);
    }
  }
}

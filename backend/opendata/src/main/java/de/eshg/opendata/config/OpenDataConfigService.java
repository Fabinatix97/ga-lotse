/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.config;

import static de.eshg.opendata.config.OpenDataConfigAuditLogMapper.getRelevantFieldsForLogging;

import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.config.i18n.MultiLangFileName;
import de.eshg.config.mapper.MultiLangDocumentMapper;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import java.util.SequencedMap;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
public class OpenDataConfigService extends EshgConfigurationService<OpenDataConfiguration> {
  public static final MultiLangFileName TERMS_OF_USE_USER_FILENAME =
      new MultiLangFileName("Nutzungsbedingungen.pdf", "terms-of-use.pdf");
  public static final MultiLangFileName TERMS_OF_USE_CONFIG_FILENAME =
      MultiLangFileName.fromFilenameWithLanguageTags(TERMS_OF_USE_USER_FILENAME.de());

  private static final String CONFIGURATION_ENDPOINT = "OPEN_DATA";
  private final InitialOpenDataConfiguration initialOpenDataConfiguration;
  private final AuditLogWriter auditLogWriter;

  public OpenDataConfigService(
      InitialOpenDataConfiguration initialOpenDataConfiguration,
      EntityManager entityManager,
      AuditLogWriter auditLogWriter,
      TransactionHelper transactionHelper) {
    super(entityManager, transactionHelper, OpenDataConfiguration.class);
    this.initialOpenDataConfiguration = initialOpenDataConfiguration;
    this.auditLogWriter = auditLogWriter;
  }

  @Override
  public OpenDataConfiguration getConfig() {
    return super.getConfig();
  }

  @Override
  protected OpenDataConfiguration getInitialConfiguration() throws Exception {
    OpenDataConfiguration openDataConfiguration = new OpenDataConfiguration();
    openDataConfiguration.setAuthor(initialOpenDataConfiguration.author());
    openDataConfiguration.setFallbackLicenseUrl(initialOpenDataConfiguration.fallbackLicenseUrl());

    MultiLangDocument termsOfUse = new MultiLangDocument();
    termsOfUse.updateDe(initialOpenDataConfiguration.termsOfUse().getContentAsByteArray());
    openDataConfiguration.setTermsOfUse(termsOfUse);

    return openDataConfiguration;
  }

  @Transactional(propagation = Propagation.REQUIRED)
  public void updateConfig(OpenDataConfiguration updateOpenDataConfiguration) {
    OpenDataConfiguration config = getConfig();
    auditLogWriter.writeChangeToAuditLog(
        "openDataConfiguration",
        getRelevantFieldsForLogging(config),
        getRelevantFieldsForLogging(updateOpenDataConfiguration));
    config.setInitialized(true);
    config.setAuthor(updateOpenDataConfiguration.getAuthor());
    config.setFallbackLicenseUrl(updateOpenDataConfiguration.getFallbackLicenseUrl());

    MultiLangDocument persistedDocument = config.getTermsOfUse();
    persistedDocument.updateDe(updateOpenDataConfiguration.getTermsOfUse().getDe());
    persistedDocument.updateEn(updateOpenDataConfiguration.getTermsOfUse().getEn());
  }

  @Override
  @Transactional(propagation = Propagation.REQUIRED, readOnly = true)
  public SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    return MapUtils.orderedMapOf(CONFIGURATION_ENDPOINT, mapToConfigurationStatus(getConfig()));
  }

  private ConfigurationStatus mapToConfigurationStatus(OpenDataConfiguration config) {
    if (!config.isInitialized()) {
      return ConfigurationStatus.INCOMPLETE;
    }
    return MultiLangDocumentMapper.mapToConfigurationStatus(config.getTermsOfUse());
  }
}

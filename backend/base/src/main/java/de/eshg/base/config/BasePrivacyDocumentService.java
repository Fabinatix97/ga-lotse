/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import static de.eshg.util.ResourceUtils.assertIsReadable;

import de.eshg.base.config.BasePrivacyDocumentService.MandatoryInitialPrivacyDocuments;
import de.eshg.base.config.persistence.entity.BasePrivacyDocumentsConfig;
import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationEndpoint;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.departmentinfo.AbstractPrivacyDocumentService;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.config.initialization.InitialPrivacyDocuments;
import de.eshg.config.mapper.MultiLangDocumentMapper;
import de.eshg.config.spring.DepartmentInfoPropertyBinding;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import jakarta.validation.constraints.NotNull;
import java.util.SequencedMap;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
@EnableConfigurationProperties(MandatoryInitialPrivacyDocuments.class)
public class BasePrivacyDocumentService
    extends AbstractPrivacyDocumentService<BasePrivacyDocumentsConfig> {

  private final MandatoryInitialPrivacyDocuments initialPrivacyDocuments;

  BasePrivacyDocumentService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      MandatoryInitialPrivacyDocuments initialPrivacyDocuments,
      AuditLogWriter auditLogWriter) {
    super(entityManager, transactionHelper, auditLogWriter, BasePrivacyDocumentsConfig.class);
    this.initialPrivacyDocuments = initialPrivacyDocuments;
  }

  @Override
  protected BasePrivacyDocumentsConfig getConfig() {
    return super.getConfig();
  }

  @Override
  protected BasePrivacyDocumentsConfig getInitialConfiguration() throws Exception {
    BasePrivacyDocumentsConfig basePrivacyDocumentsConfig = new BasePrivacyDocumentsConfig();

    MultiLangDocument privacyNotice = new MultiLangDocument();
    privacyNotice.updateDe(initialPrivacyDocuments.privacyNotice().getContentAsByteArray());
    basePrivacyDocumentsConfig.setPrivacyNotice(privacyNotice);

    MultiLangDocument privacyPolicy = new MultiLangDocument();
    privacyPolicy.updateDe(initialPrivacyDocuments.privacyPolicy().getContentAsByteArray());
    basePrivacyDocumentsConfig.setPrivacyPolicy(privacyPolicy);

    return basePrivacyDocumentsConfig;
  }

  @Override
  @Transactional(propagation = Propagation.REQUIRED)
  public BasePrivacyDocumentsConfig updatePrivacyNotice(MultiLangDocument privacyNoticeUpdate) {
    BasePrivacyDocumentsConfig basePrivacyDocumentsConfig =
        super.updatePrivacyNotice(privacyNoticeUpdate);
    basePrivacyDocumentsConfig.setPrivacyNoticeInitialized(true);
    return basePrivacyDocumentsConfig;
  }

  @Override
  @Transactional(propagation = Propagation.REQUIRED)
  public BasePrivacyDocumentsConfig updatePrivacyPolicy(MultiLangDocument privacyPolicyUpdate) {
    BasePrivacyDocumentsConfig basePrivacyDocumentsConfig =
        super.updatePrivacyPolicy(privacyPolicyUpdate);
    basePrivacyDocumentsConfig.setPrivacyPolicyInitialized(true);
    return basePrivacyDocumentsConfig;
  }

  @Override
  protected SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    BasePrivacyDocumentsConfig config = getConfig();
    return MapUtils.orderedMapOf(
        ConfigurationEndpoint.PRIVACY_POLICY.name(),
        toConfigurationStatus(config.isPrivacyPolicyInitialized(), config.getPrivacyPolicy()),
        ConfigurationEndpoint.PRIVACY_NOTICE.name(),
        toConfigurationStatus(config.isPrivacyNoticeInitialized(), config.getPrivacyNotice()));
  }

  private ConfigurationStatus toConfigurationStatus(
      boolean initialized, MultiLangDocument document) {
    if (!initialized) {
      return ConfigurationStatus.INCOMPLETE;
    }
    return MultiLangDocumentMapper.mapToConfigurationStatus(document);
  }

  @ConfigurationProperties(DepartmentInfoPropertyBinding.DEFAULT_PROPERTY_PREFIX)
  record MandatoryInitialPrivacyDocuments(
      @NotNull Resource privacyPolicy, @NotNull Resource privacyNotice)
      implements InitialPrivacyDocuments {

    MandatoryInitialPrivacyDocuments {
      assertIsReadable(privacyNotice, "privacy-notice");
      assertIsReadable(privacyPolicy, "privacy-policy");
    }
  }
}

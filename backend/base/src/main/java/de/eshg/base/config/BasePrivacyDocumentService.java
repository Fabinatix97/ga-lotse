/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import static de.eshg.util.ResourceUtils.assertIsReadable;

import de.eshg.base.config.BasePrivacyDocumentService.MandatoryInitialPrivacyDocuments;
import de.eshg.base.config.persistence.entity.BasePrivacyDocumentsConfig;
import de.eshg.config.departmentinfo.AbstractPrivacyDocumentService;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.config.initialization.InitialPrivacyDocuments;
import de.eshg.config.spring.DepartmentInfoPropertyBinding;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
@EnableConfigurationProperties(MandatoryInitialPrivacyDocuments.class)
public class BasePrivacyDocumentService
    extends AbstractPrivacyDocumentService<BasePrivacyDocumentsConfig> {

  private final MandatoryInitialPrivacyDocuments initialPrivacyDocuments;

  BasePrivacyDocumentService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      MandatoryInitialPrivacyDocuments initialPrivacyDocuments) {
    super(entityManager, transactionHelper, BasePrivacyDocumentsConfig.class);
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

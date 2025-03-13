/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import static de.eshg.util.ResourceUtils.assertIsReadable;

import de.eshg.base.config.BasePrivacyDocumentService.MandatoryInitialPrivacyDocuments;
import de.eshg.departmentinfo.AbstractPrivacyDocumentService;
import de.eshg.departmentinfo.domain.Document;
import de.eshg.departmentinfo.domain.PrivacyDocuments;
import de.eshg.departmentinfo.initialization.InitialPrivacyDocuments;
import de.eshg.departmentinfo.spring.DepartmentInfoPropertyBinding;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import jakarta.validation.constraints.NotNull;
import java.io.IOException;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
@EnableConfigurationProperties(MandatoryInitialPrivacyDocuments.class)
public class BasePrivacyDocumentService extends AbstractPrivacyDocumentService {

  private final MandatoryInitialPrivacyDocuments initialPrivacyDocuments;

  public BasePrivacyDocumentService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      MandatoryInitialPrivacyDocuments initialPrivacyDocuments) {
    super(entityManager, transactionHelper);
    this.initialPrivacyDocuments = initialPrivacyDocuments;
  }

  @Override
  protected PrivacyDocuments getInitialConfiguration() throws Exception {
    PrivacyDocuments privacyDocuments = new PrivacyDocuments();
    privacyDocuments.setPrivacyNotice(createDocument(initialPrivacyDocuments.privacyNotice()));
    privacyDocuments.setPrivacyPolicy(createDocument(initialPrivacyDocuments.privacyPolicy()));
    return privacyDocuments;
  }

  private Document createDocument(Resource resource) throws IOException {
    Document document = new Document();
    document.setContent(resource.getContentAsByteArray());
    return document;
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

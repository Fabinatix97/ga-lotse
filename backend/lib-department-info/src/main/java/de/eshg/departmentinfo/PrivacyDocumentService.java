/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo;

import de.eshg.base.department.DepartmentApi;
import de.eshg.departmentinfo.domain.Document;
import de.eshg.departmentinfo.domain.PrivacyDocuments;
import de.eshg.departmentinfo.initialization.InitialPrivacyDocuments;
import de.eshg.departmentinfo.initialization.OptionalInitialPrivacyDocuments;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Supplier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnMissingBean(
    value = AbstractPrivacyDocumentService.class,
    ignored = PrivacyDocumentService.class)
@EnableConfigurationProperties(OptionalInitialPrivacyDocuments.class)
public class PrivacyDocumentService extends AbstractPrivacyDocumentService {

  private final DepartmentApi departmentApi;
  private final OptionalInitialPrivacyDocuments optionalInitialPrivacyDocuments;

  protected PrivacyDocumentService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      DepartmentApi departmentApi,
      OptionalInitialPrivacyDocuments optionalInitialPrivacyDocuments) {
    super(entityManager, transactionHelper);
    this.departmentApi = departmentApi;
    this.optionalInitialPrivacyDocuments = optionalInitialPrivacyDocuments;
  }

  @Override
  public PrivacyDocuments getConfig() {
    if (optionalInitialPrivacyDocuments.usePrivacyDocumentsFromBaseModule()) {
      return getInitialConfiguration();
    }
    return super.getConfig();
  }

  @Override
  public void init() {
    if (!optionalInitialPrivacyDocuments.usePrivacyDocumentsFromBaseModule()) {
      super.init();
    }
  }

  @Override
  protected PrivacyDocuments getInitialConfiguration() {
    PrivacyDocuments privacyDocuments = new PrivacyDocuments();

    privacyDocuments.setPrivacyNotice(
        documentFromInitialConfigOrBase(
            InitialPrivacyDocuments::privacyNotice,
            () -> getContentAsByteArray(departmentApi.getPrivacyNotice().getBody())));

    privacyDocuments.setPrivacyPolicy(
        documentFromInitialConfigOrBase(
            InitialPrivacyDocuments::privacyPolicy,
            () -> getContentAsByteArray(departmentApi.getPrivacyPolicy().getBody())));

    return privacyDocuments;
  }

  private Document documentFromInitialConfigOrBase(
      Function<InitialPrivacyDocuments, Resource> fn, Supplier<byte[]> fallback) {
    byte[] bytes =
        Optional.ofNullable(optionalInitialPrivacyDocuments)
            .map(fn)
            .map(this::getContentAsByteArray)
            .orElseGet(fallback);

    Document document = new Document();
    document.setContent(bytes);

    return document;
  }

  private byte[] getContentAsByteArray(Resource resource) {
    try {
      return resource.getContentAsByteArray();
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }
}

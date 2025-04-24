/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.departmentinfo;

import de.eshg.base.department.DepartmentApi;
import de.eshg.config.domain.Document;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.config.domain.PrivacyDocumentsConfig;
import de.eshg.config.initialization.InitialPrivacyDocuments;
import de.eshg.config.initialization.OptionalInitialPrivacyDocuments;
import de.eshg.config.spring.ConditionalOnBusinessModule;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Supplier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@ConditionalOnBusinessModule
@ConditionalOnMissingBean(AbstractPrivacyDocumentService.class)
@EnableConfigurationProperties(OptionalInitialPrivacyDocuments.class)
@ConditionalOnProperty(
    value = "de.eshg.privacy-documents.enabled",
    havingValue = "true",
    matchIfMissing = true)
public class PrivacyDocumentService extends AbstractPrivacyDocumentService<PrivacyDocumentsConfig> {

  private final DepartmentApi departmentApi;
  private final OptionalInitialPrivacyDocuments optionalInitialPrivacyDocuments;

  protected PrivacyDocumentService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      DepartmentApi departmentApi,
      OptionalInitialPrivacyDocuments optionalInitialPrivacyDocuments) {
    super(entityManager, transactionHelper, PrivacyDocumentsConfig.class);
    this.departmentApi = departmentApi;
    this.optionalInitialPrivacyDocuments = optionalInitialPrivacyDocuments;
  }

  @Override
  protected PrivacyDocumentsConfig getConfig() {
    return super.getConfig();
  }

  @Override
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyNoticeDe() {
    return PrivacyDocumentHelper.privacyNoticeAttachmentResponse(
        Optional.ofNullable(getConfig().getPrivacyNotice())
            .map(MultiLangDocument::getDe)
            .map(Document::getContent)
            .orElseGet(() -> getContentAsByteArray(departmentApi.getPrivacyNotice().getBody())));
  }

  @Override
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyPolicyDe() {
    return PrivacyDocumentHelper.privacyPolicyAttachmentResponse(
        Optional.ofNullable(getConfig().getPrivacyPolicy())
            .map(MultiLangDocument::getDe)
            .map(Document::getContent)
            .orElseGet(() -> getContentAsByteArray(departmentApi.getPrivacyPolicy().getBody())));
  }

  @Override
  protected PrivacyDocumentsConfig getInitialConfiguration() {
    PrivacyDocumentsConfig privacyDocumentsConfig = new PrivacyDocumentsConfig();
    privacyDocumentsConfig.setPrivacyNotice(createInitialPrivacyNotice());
    privacyDocumentsConfig.setPrivacyPolicy(createInitialPrivacyPolicy());
    return privacyDocumentsConfig;
  }

  @Override
  protected MultiLangDocument updatePrivacyDocument(
      MultiLangDocument persistedDocument, MultiLangDocument documentUpdate) {
    if (documentUpdate == null || persistedDocument == null) {
      return documentUpdate;
    }
    return super.updatePrivacyDocument(persistedDocument, documentUpdate);
  }

  private MultiLangDocument createInitialPrivacyPolicy() {
    if (optionalInitialPrivacyDocuments.usePrivacyDocumentsFromBaseModule()) {
      return null;
    }

    MultiLangDocument privacyDocuments = new MultiLangDocument();
    privacyDocuments.updateDe(
        contentFromInitialConfigOrBase(
            InitialPrivacyDocuments::privacyPolicy,
            () -> getContentAsByteArray(departmentApi.getPrivacyPolicy().getBody())));
    return privacyDocuments;
  }

  private MultiLangDocument createInitialPrivacyNotice() {
    if (optionalInitialPrivacyDocuments.usePrivacyDocumentsFromBaseModule()) {
      return null;
    }

    MultiLangDocument privacyDocuments = new MultiLangDocument();
    privacyDocuments.updateDe(
        contentFromInitialConfigOrBase(
            InitialPrivacyDocuments::privacyNotice,
            () -> getContentAsByteArray(departmentApi.getPrivacyNotice().getBody())));
    return privacyDocuments;
  }

  private byte[] contentFromInitialConfigOrBase(
      Function<InitialPrivacyDocuments, Resource> fn, Supplier<byte[]> fallback) {
    return Optional.ofNullable(optionalInitialPrivacyDocuments)
        .map(fn)
        .map(this::getContentAsByteArray)
        .orElseGet(fallback);
  }

  private byte[] getContentAsByteArray(Resource resource) {
    try {
      return resource.getContentAsByteArray();
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }
}

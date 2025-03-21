/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo;

import de.eshg.base.department.DepartmentApi;
import de.eshg.departmentinfo.domain.Document;
import de.eshg.departmentinfo.domain.PrivacyDocument;
import de.eshg.departmentinfo.domain.PrivacyDocumentsConfig;
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
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@ConditionalOnMissingBean(
    value = AbstractPrivacyDocumentService.class,
    ignored = PrivacyDocumentService.class)
@EnableConfigurationProperties(OptionalInitialPrivacyDocuments.class)
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
            .map(PrivacyDocument::getDe)
            .map(Document::getContent)
            .orElseGet(() -> getContentAsByteArray(departmentApi.getPrivacyNotice().getBody())));
  }

  @Override
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyPolicyDe() {
    return PrivacyDocumentHelper.privacyPolicyAttachmentResponse(
        Optional.ofNullable(getConfig().getPrivacyPolicy())
            .map(PrivacyDocument::getDe)
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
  protected PrivacyDocument updatePrivacyDocument(
      PrivacyDocument persistedDocument, PrivacyDocument documentUpdate) {
    if (documentUpdate == null || persistedDocument == null) {
      return documentUpdate;
    }
    return super.updatePrivacyDocument(persistedDocument, documentUpdate);
  }

  private PrivacyDocument createInitialPrivacyPolicy() {
    if (optionalInitialPrivacyDocuments.usePrivacyDocumentsFromBaseModule()) {
      return null;
    }

    PrivacyDocument privacyDocuments = new PrivacyDocument();
    privacyDocuments.updateDe(
        contentFromInitialConfigOrBase(
            InitialPrivacyDocuments::privacyPolicy,
            () -> getContentAsByteArray(departmentApi.getPrivacyPolicy().getBody())));
    return privacyDocuments;
  }

  private PrivacyDocument createInitialPrivacyNotice() {
    if (optionalInitialPrivacyDocuments.usePrivacyDocumentsFromBaseModule()) {
      return null;
    }

    PrivacyDocument privacyDocuments = new PrivacyDocument();
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

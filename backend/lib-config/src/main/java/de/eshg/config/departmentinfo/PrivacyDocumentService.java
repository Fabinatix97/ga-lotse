/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.departmentinfo;

import static de.eshg.config.departmentinfo.ConfigAuditLogMapper.getRelevantFieldsForLogging;
import static de.eshg.config.i18n.MultiLangDocumentHelper.forwardInternationalizedResponse;

import de.eshg.base.department.PublicDepartmentApi;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.config.domain.PrivacyDocumentsConfig;
import de.eshg.config.i18n.MultiLangDocumentHelper;
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

  private final PublicDepartmentApi publicDepartmentApi;
  private final OptionalInitialPrivacyDocuments optionalInitialPrivacyDocuments;

  protected PrivacyDocumentService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      PublicDepartmentApi publicDepartmentApi,
      AuditLogWriter auditLogWriter,
      OptionalInitialPrivacyDocuments optionalInitialPrivacyDocuments) {
    super(entityManager, transactionHelper, auditLogWriter, PrivacyDocumentsConfig.class);
    this.publicDepartmentApi = publicDepartmentApi;
    this.optionalInitialPrivacyDocuments = optionalInitialPrivacyDocuments;
  }

  @Override
  protected PrivacyDocumentsConfig getConfig() {
    return super.getConfig();
  }

  @Override
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyNotice() {
    return Optional.ofNullable(getConfig().getPrivacyNotice())
        .map(
            privacyNotice ->
                MultiLangDocumentHelper.getAsPdfResponseByCurrentLanguageWithFallback(
                    privacyNotice, PRIVACY_NOTICE_FILE_NAME))
        .orElseGet(() -> forwardInternationalizedResponse(publicDepartmentApi.getPrivacyNotice()));
  }

  @Override
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyPolicy() {
    return Optional.ofNullable(getConfig().getPrivacyPolicy())
        .map(
            privacyPolicy ->
                MultiLangDocumentHelper.getAsPdfResponseByCurrentLanguageWithFallback(
                    privacyPolicy, PRIVACY_POLICY_FILE_NAME))
        .orElseGet(() -> forwardInternationalizedResponse(publicDepartmentApi.getPrivacyPolicy()));
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
    auditLogWriter.writeChangeToAuditlog(
        "privacyDocumentsConfig",
        getRelevantFieldsForLogging(persistedDocument),
        getRelevantFieldsForLogging(documentUpdate));
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
            () -> getContentAsByteArray(publicDepartmentApi.getPrivacyPolicy().getBody())));
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
            () -> getContentAsByteArray(publicDepartmentApi.getPrivacyNotice().getBody())));
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

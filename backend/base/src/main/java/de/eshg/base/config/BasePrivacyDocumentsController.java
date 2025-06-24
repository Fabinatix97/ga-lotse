/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import static de.eshg.config.departmentinfo.PrivacyDocumentController.DE;
import static de.eshg.config.departmentinfo.PrivacyDocumentController.EN;
import static de.eshg.config.departmentinfo.PrivacyDocumentController.PRIVACY_NOTICE_PATH;
import static de.eshg.config.departmentinfo.PrivacyDocumentController.PRIVACY_POLICY_PATH;
import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.base.config.persistence.entity.BasePrivacyDocumentsConfig;
import de.eshg.config.api.GetPrivacyDocumentConfigResponse;
import de.eshg.config.api.MultiLangDocumentDto;
import de.eshg.config.departmentinfo.AbstractPrivacyDocumentService;
import de.eshg.config.departmentinfo.PrivacyDocumentController;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.config.i18n.MultiLangDocumentHelper;
import de.eshg.config.mapper.MultiLangDocumentMapper;
import de.eshg.file.common.FileValidator;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.i18n.Language;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(PrivacyDocumentController.BASE_URL)
@Tag(name = "BasePrivacyDocuments")
class BasePrivacyDocumentsController {
  private final BasePrivacyDocumentService basePrivacyDocumentService;

  BasePrivacyDocumentsController(BasePrivacyDocumentService basePrivacyDocumentService) {
    this.basePrivacyDocumentService = basePrivacyDocumentService;
  }

  @GetMapping(PRIVACY_NOTICE_PATH)
  @Transactional(readOnly = true)
  public GetPrivacyDocumentConfigResponse getPrivacyNoticeConfig() {
    BasePrivacyDocumentsConfig config = basePrivacyDocumentService.getConfig();
    return new GetPrivacyDocumentConfigResponse(mapToPrivacyNotice(config));
  }

  private MultiLangDocumentDto mapToPrivacyNotice(BasePrivacyDocumentsConfig config) {
    if (!config.isPrivacyNoticeInitialized()) {
      return null;
    }
    MultiLangDocument privacyNotice = basePrivacyDocumentService.getConfig().getPrivacyNotice();
    return MultiLangDocumentMapper.mapToDto(
        privacyNotice, AbstractPrivacyDocumentService.PRIVACY_NOTICE_CONFIG_FILENAME);
  }

  @GetMapping(PRIVACY_NOTICE_PATH + "/{lang}")
  @ApiResponse(
      responseCode = "200",
      content =
          @Content(
              mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE,
              schema = @Schema(format = "binary")))
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> downloadPrivacyNotice(
      @PathVariable(name = "lang") Language lang) {
    BasePrivacyDocumentsConfig config = basePrivacyDocumentService.getConfig();
    if (!config.isPrivacyNoticeInitialized()) {
      throw new NotFoundException("Privacy notice is not initialized");
    }

    MultiLangDocument multiLangDocument = config.getPrivacyNotice();
    return MultiLangDocumentHelper.getAsResourceByLanguageOrThrow(
        multiLangDocument,
        AbstractPrivacyDocumentService.PRIVACY_NOTICE_CONFIG_FILENAME,
        lang,
        MediaType.APPLICATION_PDF);
  }

  @PutMapping(value = PRIVACY_NOTICE_PATH, consumes = MULTIPART_FORM_DATA_VALUE)
  @Transactional
  public void updatePrivacyNoticeConfig(
      @RequestPart(DE) MultipartFile privacyNoticeDe,
      @RequestPart(value = EN, required = false) MultipartFile privacyNoticeEn)
      throws IOException {
    FileValidator.validatePdfFile(privacyNoticeDe);
    FileValidator.validatePdfFile(privacyNoticeEn);
    basePrivacyDocumentService.updatePrivacyNotice(
        MultiLangDocumentMapper.mapToDomain(privacyNoticeDe, privacyNoticeEn));
  }

  @GetMapping(PRIVACY_POLICY_PATH)
  @Transactional(readOnly = true)
  public GetPrivacyDocumentConfigResponse getPrivacyPolicyConfig() {
    BasePrivacyDocumentsConfig config = basePrivacyDocumentService.getConfig();
    return new GetPrivacyDocumentConfigResponse(mapToPrivacyPolicy(config));
  }

  private MultiLangDocumentDto mapToPrivacyPolicy(BasePrivacyDocumentsConfig config) {
    if (!config.isPrivacyPolicyInitialized()) {
      return null;
    }
    return MultiLangDocumentMapper.mapToDto(
        config.getPrivacyPolicy(), AbstractPrivacyDocumentService.PRIVACY_POLICY_CONFIG_FILENAME);
  }

  @GetMapping(PRIVACY_POLICY_PATH + "/{lang}")
  @ApiResponse(
      responseCode = "200",
      content =
          @Content(
              mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE,
              schema = @Schema(format = "binary")))
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> downloadPrivacyPolicy(
      @PathVariable(name = "lang") Language lang) {
    BasePrivacyDocumentsConfig config = basePrivacyDocumentService.getConfig();
    if (!config.isPrivacyPolicyInitialized()) {
      throw new NotFoundException("Privacy policy is not initialized");
    }

    MultiLangDocument multiLangDocument = config.getPrivacyPolicy();
    return MultiLangDocumentHelper.getAsResourceByLanguageOrThrow(
        multiLangDocument,
        AbstractPrivacyDocumentService.PRIVACY_POLICY_CONFIG_FILENAME,
        lang,
        MediaType.APPLICATION_PDF);
  }

  @PutMapping(value = PRIVACY_POLICY_PATH, consumes = MULTIPART_FORM_DATA_VALUE)
  @Transactional
  public void updatePrivacyPolicyConfig(
      @RequestPart(DE) MultipartFile privacyPolicyDe,
      @RequestPart(value = EN, required = false) MultipartFile privacyPolicyEn)
      throws IOException {
    FileValidator.validatePdfFile(privacyPolicyDe);
    FileValidator.validatePdfFile(privacyPolicyEn);
    basePrivacyDocumentService.updatePrivacyPolicy(
        MultiLangDocumentMapper.mapToDomain(privacyPolicyDe, privacyPolicyEn));
  }
}

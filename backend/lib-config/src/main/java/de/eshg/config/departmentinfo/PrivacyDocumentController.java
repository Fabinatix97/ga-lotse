/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.departmentinfo;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.config.api.GetPrivacyDocumentConfigResponse;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.config.i18n.MultiLangDocumentHelper;
import de.eshg.config.mapper.MultiLangDocumentMapper;
import de.eshg.file.common.FileValidator;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.i18n.Language;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
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
@ConditionalOnBean(PrivacyDocumentService.class)
@Tag(name = "PrivacyDocument")
public class PrivacyDocumentController {

  public static final String DE = "de";
  public static final String EN = "en";

  public static final String BASE_URL =
      BaseUrls.DepartmentInfoLibrary.CONFIGURATION_API + "/privacy-documents";
  public static final String PRIVACY_NOTICE_PATH = "/privacy-notice";
  public static final String PRIVACY_POLICY_PATH = "/privacy-policy";

  private final PrivacyDocumentService privacyDocumentService;

  PrivacyDocumentController(PrivacyDocumentService privacyDocumentService) {
    this.privacyDocumentService = privacyDocumentService;
  }

  @GetMapping(PRIVACY_POLICY_PATH)
  @Transactional(readOnly = true)
  public GetPrivacyDocumentConfigResponse getPrivacyPolicyConfig() {
    return new GetPrivacyDocumentConfigResponse(
        MultiLangDocumentMapper.mapToDto(
            privacyDocumentService.getConfig().getPrivacyPolicy(),
            AbstractPrivacyDocumentService.PRIVACY_POLICY_CONFIG_FILENAME));
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
    MultiLangDocument privacyPolicy = privacyDocumentService.getConfig().getPrivacyPolicy();
    if (privacyPolicy == null) {
      throw new NotFoundException("Privacy policy does not exist");
    }

    return MultiLangDocumentHelper.getAsResourceByLanguageOrThrow(
        privacyPolicy,
        AbstractPrivacyDocumentService.PRIVACY_POLICY_CONFIG_FILENAME,
        lang,
        MediaType.APPLICATION_PDF);
  }

  @PutMapping(value = PRIVACY_POLICY_PATH, consumes = MULTIPART_FORM_DATA_VALUE)
  @Transactional
  public void updatePrivacyPolicyConfig(
      @RequestPart(value = DE, required = false) MultipartFile privacyPolicyDe,
      @RequestPart(value = EN, required = false) MultipartFile privacyPolicyEn)
      throws IOException {
    if (privacyPolicyDe == null && privacyPolicyEn != null) {
      throw createMandatoryMissingException();
    }
    FileValidator.validatePdfFile(privacyPolicyDe);
    FileValidator.validatePdfFile(privacyPolicyEn);

    privacyDocumentService.updatePrivacyPolicy(
        MultiLangDocumentMapper.mapToDomain(privacyPolicyDe, privacyPolicyEn));
  }

  @GetMapping(PRIVACY_NOTICE_PATH)
  @Transactional(readOnly = true)
  public GetPrivacyDocumentConfigResponse getPrivacyNoticeConfig() {
    return new GetPrivacyDocumentConfigResponse(
        MultiLangDocumentMapper.mapToDto(
            privacyDocumentService.getConfig().getPrivacyNotice(),
            AbstractPrivacyDocumentService.PRIVACY_NOTICE_CONFIG_FILENAME));
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
    MultiLangDocument privacyNotice = privacyDocumentService.getConfig().getPrivacyNotice();
    if (privacyNotice == null) {
      throw new NotFoundException("Privacy notice does not exist");
    }

    return MultiLangDocumentHelper.getAsResourceByLanguageOrThrow(
        privacyNotice,
        AbstractPrivacyDocumentService.PRIVACY_NOTICE_CONFIG_FILENAME,
        lang,
        MediaType.APPLICATION_PDF);
  }

  @PutMapping(value = PRIVACY_NOTICE_PATH, consumes = MULTIPART_FORM_DATA_VALUE)
  @Transactional
  public void updatePrivacyNoticeConfig(
      @RequestPart(value = DE, required = false) MultipartFile privacyNoticeDe,
      @RequestPart(value = EN, required = false) MultipartFile privacyNoticeEn)
      throws IOException {
    if (privacyNoticeDe == null && privacyNoticeEn != null) {
      throw createMandatoryMissingException();
    }
    FileValidator.validatePdfFile(privacyNoticeDe);
    FileValidator.validatePdfFile(privacyNoticeEn);

    privacyDocumentService.updatePrivacyNotice(
        MultiLangDocumentMapper.mapToDomain(privacyNoticeDe, privacyNoticeEn));
  }

  private BadRequestException createMandatoryMissingException() {
    return new BadRequestException("If mandatory de is not given then en cannot be given as well");
  }
}

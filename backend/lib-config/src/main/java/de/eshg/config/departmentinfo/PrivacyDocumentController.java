/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.departmentinfo;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.config.api.GetPrivacyDocumentConfigResponse;
import de.eshg.config.mapper.PrivacyDocumentMapper;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
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

  public static final String BASE_URL = BaseUrls.DepartmentInfoLibrary.PRIVACY_DOCUMENTS_API;
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
        PrivacyDocumentMapper.mapToPrivacyPolicyDto(
            privacyDocumentService.getConfig().getPrivacyPolicy()));
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

    privacyDocumentService.updatePrivacyPolicy(
        PrivacyDocumentMapper.mapToDomain(privacyPolicyDe, privacyPolicyEn));
  }

  @GetMapping(PRIVACY_NOTICE_PATH)
  @Transactional(readOnly = true)
  public GetPrivacyDocumentConfigResponse getPrivacyNoticeConfig() {
    return new GetPrivacyDocumentConfigResponse(
        PrivacyDocumentMapper.mapToPrivacyNoticeDto(
            privacyDocumentService.getConfig().getPrivacyNotice()));
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

    privacyDocumentService.updatePrivacyNotice(
        PrivacyDocumentMapper.mapToDomain(privacyNoticeDe, privacyNoticeEn));
  }

  private BadRequestException createMandatoryMissingException() {
    return new BadRequestException("If mandatory de is not given then en cannot be given as well");
  }
}

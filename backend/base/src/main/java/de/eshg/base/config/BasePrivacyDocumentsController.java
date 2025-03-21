/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import static de.eshg.departmentinfo.PrivacyDocumentController.DE;
import static de.eshg.departmentinfo.PrivacyDocumentController.EN;
import static de.eshg.departmentinfo.PrivacyDocumentController.PRIVACY_NOTICE_PATH;
import static de.eshg.departmentinfo.PrivacyDocumentController.PRIVACY_POLICY_PATH;
import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.departmentinfo.api.PrivacyDocumentDto;
import de.eshg.departmentinfo.mapper.PrivacyDocumentMapper;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(BasePrivacyDocumentsController.BASE_URL)
@Tag(name = "BasePrivacyDocuments")
class BasePrivacyDocumentsController {
  public static final String BASE_URL = BaseUrls.DepartmentInfoLibrary.PRIVACY_DOCUMENTS_API;

  private final BasePrivacyDocumentService basePrivacyDocumentService;

  BasePrivacyDocumentsController(BasePrivacyDocumentService basePrivacyDocumentService) {
    this.basePrivacyDocumentService = basePrivacyDocumentService;
  }

  @GetMapping(PRIVACY_NOTICE_PATH)
  @Transactional(readOnly = true)
  public PrivacyDocumentDto getPrivacyNoticeConfig() {
    return PrivacyDocumentMapper.mapToPrivacyNoticeDto(
        basePrivacyDocumentService.getConfig().getPrivacyNotice());
  }

  @PutMapping(value = PRIVACY_NOTICE_PATH, consumes = MULTIPART_FORM_DATA_VALUE)
  @Transactional
  public void updatePrivacyNoticeConfig(
      @RequestPart(DE) MultipartFile privacyNoticeDe,
      @RequestPart(value = EN, required = false) MultipartFile privacyNoticeEn)
      throws IOException {
    basePrivacyDocumentService.updatePrivacyNotice(
        PrivacyDocumentMapper.mapToDomain(privacyNoticeDe, privacyNoticeEn));
  }

  @GetMapping(PRIVACY_POLICY_PATH)
  @Transactional(readOnly = true)
  public PrivacyDocumentDto getPrivacyPolicyConfig() {
    return PrivacyDocumentMapper.mapToPrivacyPolicyDto(
        basePrivacyDocumentService.getConfig().getPrivacyPolicy());
  }

  @PutMapping(value = PRIVACY_POLICY_PATH, consumes = MULTIPART_FORM_DATA_VALUE)
  @Transactional
  public void updatePrivacyPolicyConfig(
      @RequestPart(DE) MultipartFile privacyPolicyDe,
      @RequestPart(value = EN, required = false) MultipartFile privacyPolicyEn)
      throws IOException {
    basePrivacyDocumentService.updatePrivacyPolicy(
        PrivacyDocumentMapper.mapToDomain(privacyPolicyDe, privacyPolicyEn));
  }
}

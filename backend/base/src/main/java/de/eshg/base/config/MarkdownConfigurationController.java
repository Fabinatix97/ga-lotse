/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import static de.eshg.base.config.MarkdownConfigurationController.BASE_URL;
import static de.eshg.config.mapper.MultiLangDocumentMapper.mapToDomain;
import static de.eshg.rest.service.security.config.BaseUrls.Base.ACKNOWLEDGEMENTS_MARKDOWN_CONFIG_API;
import static de.eshg.rest.service.security.config.BaseUrls.Base.CONFIGURATION_API_MARKDOWN_FILES_CITIZEN;
import static de.eshg.rest.service.security.config.BaseUrls.Base.CONFIGURATION_API_MARKDOWN_FILES_EMPLOYEE;
import static de.eshg.rest.service.security.config.BaseUrls.Base.CONTACT_MARKDOWN_CONFIG_API;
import static de.eshg.rest.service.security.config.BaseUrls.Base.DECLARATION_OF_ACCESSIBILITY_MARKDOWN_CONFIG_API;
import static de.eshg.rest.service.security.config.BaseUrls.Base.IMPRINT_MARKDOWN_CONFIG_API;
import static de.eshg.rest.service.security.config.BaseUrls.Base.PRIVACY_POLICY_MARKDOWN_CONFIG_API;
import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.base.config.api.CitizenAndEmployeeMarkdownInfo;
import de.eshg.base.config.api.InternationalMarkdownInfo;
import de.eshg.base.department.CitizenPortalMarkdownName;
import de.eshg.base.department.EmployeePortalMarkdownName;
import de.eshg.base.department.LanguageDto;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.file.common.FileValidator;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
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
@RequestMapping(BASE_URL)
@Tag(name = "MarkdownConfiguration")
public class MarkdownConfigurationController {

  public static final String BASE_URL = BaseUrls.DepartmentInfoLibrary.CONFIGURATION_API;
  public static final String CITIZEN_PREFIX = "citizen_";
  public static final String EMPLOYEE_PREFIX = "employee_";
  public static final String DE = "de";
  public static final String EN = "en";

  private final DepartmentConfigurationService departmentConfigurationService;
  private final BaseConfigurationProperties baseConfigurationProperties;
  private final MarkdownMapper markdownMapper;

  public MarkdownConfigurationController(
      DepartmentConfigurationService departmentConfigurationService,
      BaseConfigurationProperties baseConfigurationProperties,
      MarkdownMapper markdownMapper) {
    this.departmentConfigurationService = departmentConfigurationService;
    this.baseConfigurationProperties = baseConfigurationProperties;
    this.markdownMapper = markdownMapper;
  }

  @GetMapping(DECLARATION_OF_ACCESSIBILITY_MARKDOWN_CONFIG_API)
  @Transactional(readOnly = true)
  public CitizenAndEmployeeMarkdownInfo getAccessibilityInfo() {
    return departmentConfigurationService.getAccessibilityInfo();
  }

  @GetMapping(ACKNOWLEDGEMENTS_MARKDOWN_CONFIG_API)
  @Transactional(readOnly = true)
  public InternationalMarkdownInfo getAcknowledgementsInfo() {
    return departmentConfigurationService.getAcknowledgementsInfo();
  }

  @GetMapping(CONTACT_MARKDOWN_CONFIG_API)
  @Transactional(readOnly = true)
  public InternationalMarkdownInfo getContactInfo() {
    return departmentConfigurationService.getContactInfo();
  }

  @GetMapping(IMPRINT_MARKDOWN_CONFIG_API)
  @Transactional(readOnly = true)
  public InternationalMarkdownInfo getImprintInfo() {
    return departmentConfigurationService.getImprintInfo();
  }

  @GetMapping(PRIVACY_POLICY_MARKDOWN_CONFIG_API)
  @Transactional(readOnly = true)
  public CitizenAndEmployeeMarkdownInfo getPrivacyInfo() {
    return departmentConfigurationService.getPrivacyInfo();
  }

  @GetMapping(CONFIGURATION_API_MARKDOWN_FILES_CITIZEN + "/{name}/{lang}")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getCitizenMarkdownFile(
      @PathVariable("name") CitizenPortalMarkdownName name,
      @PathVariable("lang") LanguageDto lang) {
    return markdownAttachmentResponse(
        markdownMapper.getFileName(name, lang),
        new ByteArrayResource(
            departmentConfigurationService.getSpecificMarkdownOrThrow(name, mapToDomain(lang))));
  }

  @GetMapping(CONFIGURATION_API_MARKDOWN_FILES_EMPLOYEE + "/{name}/{lang}")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getEmployeeMarkdownFile(
      @PathVariable("name") EmployeePortalMarkdownName name,
      @PathVariable("lang") LanguageDto lang) {
    return markdownAttachmentResponse(
        markdownMapper.getFileName(name, lang),
        new ByteArrayResource(
            departmentConfigurationService.getSpecificMarkdownOrThrow(name, mapToDomain(lang))));
  }

  @PutMapping(
      value = DECLARATION_OF_ACCESSIBILITY_MARKDOWN_CONFIG_API,
      consumes = MULTIPART_FORM_DATA_VALUE)
  @Transactional
  public void updateAccessibilityMarkdown(
      @RequestPart(CITIZEN_PREFIX + DE) MultipartFile citizenAccessibilityDe,
      @RequestPart(value = CITIZEN_PREFIX + EN, required = false)
          MultipartFile citizenAccessibilityEn,
      @RequestPart(EMPLOYEE_PREFIX + DE) MultipartFile employeeAccessibilityDe,
      @RequestPart(value = EMPLOYEE_PREFIX + EN, required = false)
          MultipartFile employeeAccessibilityEn)
      throws IOException {
    departmentConfigurationService.updateAccessibility(
        validateAndMapToDomain(citizenAccessibilityDe, citizenAccessibilityEn),
        validateAndMapToDomain(employeeAccessibilityDe, employeeAccessibilityEn));
  }

  @PutMapping(value = ACKNOWLEDGEMENTS_MARKDOWN_CONFIG_API, consumes = MULTIPART_FORM_DATA_VALUE)
  @Transactional
  public void updateAcknowledgementsMarkdown(
      @RequestPart(DE) MultipartFile commonAcknowledgementsDe,
      @RequestPart(value = EN, required = false) MultipartFile commonAcknowledgementsEn)
      throws IOException {
    departmentConfigurationService.updateAcknowledgements(
        validateAndMapToDomain(commonAcknowledgementsDe, commonAcknowledgementsEn));
  }

  @PutMapping(value = CONTACT_MARKDOWN_CONFIG_API, consumes = MULTIPART_FORM_DATA_VALUE)
  @Transactional
  public void updateContactMarkdown(
      @RequestPart(DE) MultipartFile employeeContactDe,
      @RequestPart(value = EN, required = false) MultipartFile employeeContactEn)
      throws IOException {
    departmentConfigurationService.updateEmployeeContact(
        validateAndMapToDomain(employeeContactDe, employeeContactEn));
  }

  @PutMapping(value = IMPRINT_MARKDOWN_CONFIG_API, consumes = MULTIPART_FORM_DATA_VALUE)
  @Transactional
  public void updateImprintMarkdown(
      @RequestPart(DE) MultipartFile citizenImprintDe,
      @RequestPart(value = EN, required = false) MultipartFile citizenImprintEn)
      throws IOException {
    departmentConfigurationService.updateCitizenImprint(
        validateAndMapToDomain(citizenImprintDe, citizenImprintEn));
  }

  @PutMapping(value = PRIVACY_POLICY_MARKDOWN_CONFIG_API, consumes = MULTIPART_FORM_DATA_VALUE)
  @Transactional
  public void updatePrivacyMarkdown(
      @RequestPart(CITIZEN_PREFIX + DE) MultipartFile citizenPrivacyDe,
      @RequestPart(value = CITIZEN_PREFIX + EN, required = false) MultipartFile citizenPrivacyEn,
      @RequestPart(EMPLOYEE_PREFIX + DE) MultipartFile employeePrivacyDe,
      @RequestPart(value = EMPLOYEE_PREFIX + EN, required = false) MultipartFile employeePrivacyEn)
      throws IOException {
    departmentConfigurationService.updatePrivacy(
        validateAndMapToDomain(citizenPrivacyDe, citizenPrivacyEn),
        validateAndMapToDomain(employeePrivacyDe, employeePrivacyEn));
  }

  private MultiLangDocument validateAndMapToDomain(MultipartFile de, MultipartFile en)
      throws IOException {
    return mapToDomain(validate(de), validate(en));
  }

  private MultipartFile validate(MultipartFile input) {
    if (input == null) {
      return null;
    }
    if (input.getSize() > baseConfigurationProperties.maxMarkdownFileSizeBytes()) {
      throw new BadRequestException("File is too large");
    }
    FileValidator.validate(input);
    return input;
  }

  private ResponseEntity<Resource> markdownAttachmentResponse(String filename, Resource content) {
    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.attachment()
                .filename(filename, StandardCharsets.UTF_8)
                .build()
                .toString())
        .contentType(MediaType.TEXT_MARKDOWN)
        .body(content);
  }
}

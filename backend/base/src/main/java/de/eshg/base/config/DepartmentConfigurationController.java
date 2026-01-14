/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import static de.eshg.base.config.DepartmentConfigurationController.BASE_URL;
import static de.eshg.base.config.MarkdownMapper.*;
import static de.eshg.config.mapper.MultiLangDocumentMapper.mapToDomain;
import static de.eshg.rest.service.security.config.BaseUrls.Base.ACCESSIBILITY_STATEMENT_MARKDOWN_CONFIG_API;
import static de.eshg.rest.service.security.config.BaseUrls.Base.ACKNOWLEDGEMENTS_MARKDOWN_CONFIG_API;
import static de.eshg.rest.service.security.config.BaseUrls.Base.CONFIGURATION_API_MARKDOWN_FILES_CITIZEN;
import static de.eshg.rest.service.security.config.BaseUrls.Base.CONFIGURATION_API_MARKDOWN_FILES_EMPLOYEE;
import static de.eshg.rest.service.security.config.BaseUrls.Base.CONTACT_MARKDOWN_CONFIG_API;
import static de.eshg.rest.service.security.config.BaseUrls.Base.IMPRINT_MARKDOWN_CONFIG_API;
import static de.eshg.rest.service.security.config.BaseUrls.Base.LOGO_SVG_CONFIG_API;
import static de.eshg.rest.service.security.config.BaseUrls.Base.PRIVACY_POLICY_MARKDOWN_CONFIG_API;
import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.base.config.api.CitizenAndEmployeeMarkdownInfoDto;
import de.eshg.base.config.api.GetLogoSvgFileInfoResponse;
import de.eshg.base.config.api.GetMarkdownInfoResponse;
import de.eshg.base.department.CitizenPortalMarkdownName;
import de.eshg.base.department.EmployeePortalMarkdownName;
import de.eshg.config.api.DocumentDetailsDto;
import de.eshg.config.api.MultiLangDocumentDto;
import de.eshg.config.domain.Document;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.config.i18n.MultiLangDocumentHelper;
import de.eshg.file.common.FileValidator;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.i18n.Language;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotNull;
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
@RequestMapping(BASE_URL)
@Tag(name = "DepartmentConfiguration")
public class DepartmentConfigurationController {

  public static final String BASE_URL = BaseUrls.DepartmentInfoLibrary.CONFIGURATION_API;
  public static final String CITIZEN_PREFIX = "citizen_";
  public static final String EMPLOYEE_PREFIX = "employee_";
  public static final String DE = "de";
  public static final String EN = "en";
  public static final String SVG_FILE_PARAM_NAME = "svg";

  private final DepartmentConfigurationService departmentConfigurationService;
  private final BaseConfigurationProperties baseConfigurationProperties;
  private final SvgValidations svgValidations;

  public DepartmentConfigurationController(
      DepartmentConfigurationService departmentConfigurationService,
      BaseConfigurationProperties baseConfigurationProperties,
      SvgValidations svgValidations) {
    this.departmentConfigurationService = departmentConfigurationService;
    this.baseConfigurationProperties = baseConfigurationProperties;
    this.svgValidations = svgValidations;
  }

  @GetMapping(ACCESSIBILITY_STATEMENT_MARKDOWN_CONFIG_API)
  @Transactional(readOnly = true)
  public GetMarkdownInfoResponse<CitizenAndEmployeeMarkdownInfoDto> getAccessibilityInfo() {
    return new GetMarkdownInfoResponse<>(
        mapToAccessibilityInfo(departmentConfigurationService.getConfig()));
  }

  @GetMapping(ACKNOWLEDGEMENTS_MARKDOWN_CONFIG_API)
  @Transactional(readOnly = true)
  public GetMarkdownInfoResponse<MultiLangDocumentDto> getAcknowledgementsInfo() {
    return new GetMarkdownInfoResponse<>(
        mapToAcknowledgementInfo(departmentConfigurationService.getConfig()));
  }

  @GetMapping(CONTACT_MARKDOWN_CONFIG_API)
  @Transactional(readOnly = true)
  public GetMarkdownInfoResponse<MultiLangDocumentDto> getContactInfo() {
    return new GetMarkdownInfoResponse<>(
        mapToContactInfo(departmentConfigurationService.getConfig()));
  }

  @GetMapping(IMPRINT_MARKDOWN_CONFIG_API)
  @Transactional(readOnly = true)
  public GetMarkdownInfoResponse<MultiLangDocumentDto> getImprintInfo() {
    return new GetMarkdownInfoResponse<>(
        mapToImprintInfo(departmentConfigurationService.getConfig()));
  }

  @GetMapping(PRIVACY_POLICY_MARKDOWN_CONFIG_API)
  @Transactional(readOnly = true)
  public GetMarkdownInfoResponse<CitizenAndEmployeeMarkdownInfoDto> getPrivacyInfo() {
    return new GetMarkdownInfoResponse<>(
        mapToPrivacyInfo(departmentConfigurationService.getConfig()));
  }

  @GetMapping(CONFIGURATION_API_MARKDOWN_FILES_CITIZEN + "/{name}/{lang}")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getCitizenMarkdownFile(
      @PathVariable("name") CitizenPortalMarkdownName name, @PathVariable("lang") Language lang) {
    return MultiLangDocumentHelper.getAsResourceByLanguageOrThrow(
        departmentConfigurationService.getMarkdown(name),
        name.getFileName(),
        lang,
        MediaType.TEXT_MARKDOWN);
  }

  @GetMapping(CONFIGURATION_API_MARKDOWN_FILES_EMPLOYEE + "/{name}/{lang}")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getEmployeeMarkdownFile(
      @PathVariable("name") EmployeePortalMarkdownName name, @PathVariable("lang") Language lang) {
    return MultiLangDocumentHelper.getAsResourceByLanguageOrThrow(
        departmentConfigurationService.getMarkdown(name),
        name.getFileName(),
        lang,
        MediaType.TEXT_MARKDOWN);
  }

  @GetMapping(LOGO_SVG_CONFIG_API)
  @Transactional(readOnly = true)
  public GetLogoSvgFileInfoResponse getLogoSvgFileInfo() {
    DepartmentConfiguration departmentConfiguration = departmentConfigurationService.getConfig();
    if (departmentConfiguration.isLogoInitialized()) {
      Document logo = departmentConfiguration.getLogo();
      return new GetLogoSvgFileInfoResponse(
          new DocumentDetailsDto("logo.svg", logo.getContent().length));
    }

    return new GetLogoSvgFileInfoResponse(null);
  }

  @PutMapping(
      value = ACCESSIBILITY_STATEMENT_MARKDOWN_CONFIG_API,
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

  @PutMapping(value = LOGO_SVG_CONFIG_API, consumes = MULTIPART_FORM_DATA_VALUE)
  @Transactional
  public void updateLogoSvg(@NotNull @RequestPart(name = SVG_FILE_PARAM_NAME) MultipartFile logoSvg)
      throws IOException {
    svgValidations.validateSvg(logoSvg);
    departmentConfigurationService.updateLogoSvg(logoSvg.getResource());
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
    FileValidator.validateMarkdownFile(input);
    return input;
  }
}

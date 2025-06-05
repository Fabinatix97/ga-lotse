/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.department;

import static de.eshg.rest.service.security.config.BaseUrls.Base.DEPARTMENT_API_MARKDOWN_CITIZEN;
import static de.eshg.rest.service.security.config.BaseUrls.Base.DEPARTMENT_API_SECURITY_TXT;
import static de.eshg.rest.service.security.config.BaseUrls.Base.DEPARTMENT_API_SECURITY_TXT_PGP_KEY;

import de.eshg.base.config.BaseDepartmentInfoConfigService;
import de.eshg.base.config.BasePrivacyDocumentService;
import de.eshg.base.config.DepartmentConfigurationService;
import de.eshg.base.config.SecurityTxtService;
import de.eshg.config.i18n.MultiLangDocumentHelper;
import de.eshg.file.common.CustomMediaTypes;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.GetExchange;

@RestController
@Tag(name = "PublicDepartment")
public class PublicDepartmentController implements PublicDepartmentApi {
  private final DepartmentConfigurationService departmentConfigurationService;
  private final BaseDepartmentInfoConfigService baseDepartmentInfoService;
  private final BasePrivacyDocumentService basePrivacyDocumentService;
  private final SecurityTxtService securityTxtService;

  public PublicDepartmentController(
      DepartmentConfigurationService departmentConfiguration,
      BaseDepartmentInfoConfigService departmentInfoService,
      BasePrivacyDocumentService basePrivacyDocumentService,
      SecurityTxtService securityTxtService) {
    this.departmentConfigurationService = departmentConfiguration;
    this.baseDepartmentInfoService = departmentInfoService;
    this.basePrivacyDocumentService = basePrivacyDocumentService;
    this.securityTxtService = securityTxtService;
  }

  @Override
  public GetDepartmentInfoResponse getDepartmentInfo() {
    return baseDepartmentInfoService.getDepartmentInfo();
  }

  @Override
  public ResponseEntity<Resource> getPrivacyNotice() {
    return basePrivacyDocumentService.getPrivacyNotice();
  }

  @Override
  public ResponseEntity<Resource> getPrivacyPolicy() {
    return basePrivacyDocumentService.getPrivacyPolicy();
  }

  @Operation(summary = "Get a markdown document for the citizen portal")
  @ApiResponse(responseCode = "200")
  @GetExchange(DEPARTMENT_API_MARKDOWN_CITIZEN + "/{name}")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getCitizenPortalMarkdown(
      @PathVariable("name") CitizenPortalMarkdownName name) {
    return MultiLangDocumentHelper.getAsResponseByCurrentLanguageWithFallback(
        departmentConfigurationService.getMarkdown(name),
        name.getFileName(),
        MediaType.TEXT_MARKDOWN);
  }

  @Override
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getDepartmentLogo() {
    // svg may contain JavaScript. Make sure the image comes from a trustworthy source.
    return ResponseEntity.ok()
        .contentType(CustomMediaTypes.IMAGE_SVG_XML)
        .body(new ByteArrayResource(departmentConfigurationService.getLogo()));
  }

  @Operation(summary = "Get the security.txt file of the department running this application.")
  @ApiResponse(responseCode = "200")
  @GetExchange(DEPARTMENT_API_SECURITY_TXT)
  @Transactional(readOnly = true)
  public ResponseEntity<byte[]> getSecurityTxt() {
    return securityTxtService.getSecurityTxt();
  }

  @Operation(
      summary =
          "Get the security.txt public PGP key file of the department running this application.")
  @ApiResponse(responseCode = "200")
  @GetExchange(DEPARTMENT_API_SECURITY_TXT_PGP_KEY)
  @Transactional(readOnly = true)
  public ResponseEntity<byte[]> getSecurityTxtPublicKey() {
    return securityTxtService.getSecurityTxtPublicKey();
  }
}

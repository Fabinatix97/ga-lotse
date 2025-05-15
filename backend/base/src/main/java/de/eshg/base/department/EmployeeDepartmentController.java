/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.department;

import static de.eshg.rest.service.security.config.BaseUrls.Base.DEPARTMENT_API_MARKDOWN_EMPLOYEE;
import static de.eshg.rest.service.security.config.BaseUrls.Base.DEPARTMENT_API_MARKDOWN_RELEASE_NOTES;

import de.eshg.base.config.DepartmentConfigurationService;
import de.eshg.rest.service.i18n.LanguageContextHolder;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@RestController
@HttpExchange(EmployeeDepartmentController.BASE_URL)
@Tag(name = "EmployeeDepartment")
class EmployeeDepartmentController {

  static final String BASE_URL = BaseUrls.Base.EMPLOYEE_DEPARTMENT_API;
  private final DepartmentConfigurationService departmentConfigurationService;
  private final ReleaseNotesLoader releaseNotesLoader;

  EmployeeDepartmentController(
      DepartmentConfigurationService departmentConfigurationService,
      ReleaseNotesLoader releaseNotesLoader) {
    this.departmentConfigurationService = departmentConfigurationService;
    this.releaseNotesLoader = releaseNotesLoader;
  }

  @Operation(summary = "Get a markdown document for the employee portal")
  @ApiResponse(responseCode = "200")
  @GetExchange(DEPARTMENT_API_MARKDOWN_EMPLOYEE + "/{name}")
  @Transactional(readOnly = true)
  ResponseEntity<byte[]> getEmployeePortalMarkdown(
      @PathVariable("name") EmployeePortalMarkdownName name) {
    return ResponseEntity.ok()
        .contentType(MediaType.TEXT_MARKDOWN)
        .body(
            departmentConfigurationService.getMarkdownWithGermanFallback(
                name, LanguageContextHolder.getLanguage()));
  }

  @Operation(summary = "Get the release notes markdown")
  @ApiResponse(responseCode = "200")
  @GetExchange(DEPARTMENT_API_MARKDOWN_RELEASE_NOTES)
  ResponseEntity<byte[]> getReleaseNotesMarkdown() {
    return ResponseEntity.ok()
        .contentType(MediaType.TEXT_MARKDOWN)
        .body(
            releaseNotesLoader.getReleaseNotesWithGermanFallback(
                LanguageContextHolder.getLanguage()));
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.rest.service.security.config.BaseUrls.AuditLog;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(url = AuditLog.AUDIT_LOG_CONTROLLER)
public interface AuditLogArchivingApi {

  String ADD_AUDIT_LOG_FILE_REQUEST_PARAM_NAME = "addAuditLogFileRequest";
  String FILE_PARAM_NAME = "file";

  @PostExchange(contentType = MULTIPART_FORM_DATA_VALUE)
  @Operation(
      summary = "Add an auditlog file for a service",
      description = "POST operation to add an auditlog file for a service.")
  void addAuditlogFile(
      @RequestPart(name = ADD_AUDIT_LOG_FILE_REQUEST_PARAM_NAME) @Valid
          AddAuditLogFileRequest addAuditLogFileRequest,
      @RequestPart(name = FILE_PARAM_NAME) MultipartFile file);
}

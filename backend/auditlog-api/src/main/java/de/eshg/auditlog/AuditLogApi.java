/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.base.user.api.GetUsersResponse;
import de.eshg.rest.service.security.config.BaseUrls.AuditLog;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.io.IOException;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(url = AuditLog.AUDIT_LOG_CONTROLLER)
@Tag(name = "AuditLog")
public interface AuditLogApi {

  class QueryParameter {

    private QueryParameter() {}

    public static final String SOURCE = "source";
    public static final String START_DATE = "startDate";
    public static final String END_DATE = "endDate";
    public static final String PAGE_SIZE = "pageSize";
    public static final String PAGE_NUMBER = "pageNumber";
  }

  String DECRYPTION_KEY_HEADER_NAME = "decryption-key";

  @GetExchange
  @Operation(summary = "Decrypt and read an auditlog file for a service of a certain date.")
  ResponseEntity<String> readAuditLogFile(
      @RequestHeader(name = DECRYPTION_KEY_HEADER_NAME) @NotNull @NotBlank String key,
      @InlineParameterObject @ParameterObject @Valid
          ReadAuditLogFileRequest readAuditLogFileRequest)
      throws IOException;

  @GetExchange("/grantees-candidates")
  @Operation(summary = "List all user candidates for audit log grant access.")
  GetUsersResponse getAuditLogGranteesCandidates(
      @InlineParameterObject @ParameterObject @Valid GetAuditLogDataRequest getAuditLogDataRequest);

  @GetExchange("/grant-access")
  @Operation(summary = "List all granted accesses of audit log.")
  GetAuditLogGrantedAccessesResponse getAuditLogGrantedAccesses(
      @InlineParameterObject @ParameterObject @Valid GetAuditLogDataRequest getAuditLogDataRequest);

  @PostExchange("/grant-access")
  @Operation(
      summary =
          "Grant access to an auditlog file for a service of a certain date to a certain user.")
  void grantAuditLogAccess(
      @Valid @RequestBody GrantAuditLogAccessRequest grantAuditLogAccessRequest);

  @GetExchange("/key")
  @Operation(summary = "Get user specific asymmetrically encrypted symmetric key.")
  GetEncryptedSymmetricKeyResponse getEncryptedSymmetricKey(
      @InlineParameterObject @ParameterObject @Valid
          GetEncryptedSymmetricKeyRequest getEncryptedSymmetricKeyRequest);

  @GetExchange("/available")
  @Operation(summary = "Get a list of all available logs.")
  GetAvailableAuditLogsResponse getAvailableLogs(
      @InlineParameterObject @ParameterObject @Valid
          GetAvailableAuditLogsFilterOptions filterOptions,
      @InlineParameterObject @ParameterObject @Valid
          GetAvailableAuditLogsPaginationOptions paginationOptions);

  @GetExchange("/accessible")
  @Operation(summary = "List all audit log files accessible to the current user.")
  GetAccessibleAuditLogsResponse getAccessibleAuditLogs();
}

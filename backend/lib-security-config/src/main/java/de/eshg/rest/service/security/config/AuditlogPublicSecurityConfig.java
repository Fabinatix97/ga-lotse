/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.rest.service.security.config.BaseUrls.AuditLog;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

@Component
public final class AuditlogPublicSecurityConfig extends AbstractPublicSecurityConfiguration {
  AuditlogPublicSecurityConfig() {
    super("auditlog");

    requestMatchers(HttpMethod.GET, AuditLog.AUDIT_LOG_CONTROLLER)
        .hasRole(EmployeePermissionRole.AUDITLOG_DECRYPT_AND_ACCESS);
    requestMatchers(HttpMethod.GET, AuditLog.AUDIT_LOG_CONTROLLER + "/key")
        .hasRole(EmployeePermissionRole.AUDITLOG_DECRYPT_AND_ACCESS);
    requestMatchers(HttpMethod.GET, AuditLog.AUDIT_LOG_CONTROLLER + "/grantees-candidates")
        .hasRole(EmployeePermissionRole.AUDITLOG_AUTHORIZE_ACCESS);
    requestMatchers(HttpMethod.GET, AuditLog.AUDIT_LOG_CONTROLLER + "/grant-access")
        .hasRole(EmployeePermissionRole.AUDITLOG_AUTHORIZE_ACCESS);
    requestMatchers(HttpMethod.POST, AuditLog.AUDIT_LOG_CONTROLLER + "/grant-access")
        .hasRole(EmployeePermissionRole.AUDITLOG_AUTHORIZE_ACCESS);
    requestMatchers(HttpMethod.GET, AuditLog.AUDIT_LOG_CONTROLLER + "/available")
        .hasRole(EmployeePermissionRole.AUDITLOG_AUTHORIZE_ACCESS);
    requestMatchers(HttpMethod.GET, AuditLog.AUDIT_LOG_CONTROLLER + "/accessible")
        .hasRole(EmployeePermissionRole.AUDITLOG_DECRYPT_AND_ACCESS);
    requestMatchers(BaseUrls.AuditLog.FEATURE_TOGGLES_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import static de.eshg.lib.keycloak.EmployeePermissionRole.AUDITLOG_FILE_SEND;
import static de.eshg.lib.keycloak.EmployeePermissionRole.AUDITLOG_PUBLIC_KEYS_READ;
import static de.eshg.lib.keycloak.EmployeePermissionRole.BASE_ACCESS_CODE_USER_ADMIN;
import static de.eshg.lib.keycloak.EmployeePermissionRole.BASE_MAIL_SEND;
import static de.eshg.lib.keycloak.EmployeePermissionRole.STANDARD_EMPLOYEE;
import static de.eshg.lib.keycloak.EmployeePermissionRole.STATISTICS_STATISTICS_WRITE;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import java.util.List;
import org.apache.commons.collections4.ListUtils;

public enum ModuleClient {
  AUDITLOG("auditlog", List.of(AUDITLOG_PUBLIC_KEYS_READ)),
  BASE("base"),
  CHAT_MANAGEMENT("chat-management"),
  CITIZEN_AUTH("citizen-auth"),
  EMPLOYEE_AUTH("employee-auth"),
  INSPECTION("inspection", List.of(BASE_MAIL_SEND)),
  LOCAL_SERVICE_DIRECTORY("local-service-directory"),
  MEASLES_PROTECTION("measles-protection", List.of(BASE_MAIL_SEND)),
  SCHOOL_ENTRY("school-entry", List.of(BASE_MAIL_SEND)),
  STATISTICS("statistics", List.of(STATISTICS_STATISTICS_WRITE)),
  TRAVEL_MEDICINE("travel-medicine", List.of(BASE_MAIL_SEND, BASE_ACCESS_CODE_USER_ADMIN)),
  STI_PROTECTION("sti-protection", List.of(BASE_MAIL_SEND)),
  MEDICAL_REGISTRY("medical-registry", List.of(BASE_MAIL_SEND));

  private final String clientIdWithoutPrefix;
  private final List<EmployeePermissionRole> roles;

  ModuleClient(String clientIdWithoutPrefix, List<EmployeePermissionRole> roles) {
    this.clientIdWithoutPrefix = clientIdWithoutPrefix;
    this.roles = ListUtils.union(roles, List.of(STANDARD_EMPLOYEE, AUDITLOG_FILE_SEND));
  }

  ModuleClient(String clientIdWithoutPrefix) {
    this(clientIdWithoutPrefix, List.of());
  }

  public String getClientId() {
    return RealmBoundKeycloakClient.SYSTEM_CLIENT_ID_PREFIX + clientIdWithoutPrefix;
  }

  public String getClientName() {
    return RealmBoundKeycloakClient.SYSTEM_CLIENT_NAME_PREFIX
        + "Module Client - "
        + clientIdWithoutPrefix;
  }

  public List<EmployeePermissionRole> getRoles() {
    return roles;
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.config;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.statistics.aggregation.ReportExecution;
import jakarta.validation.constraints.NotBlank;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "eshg.statistics.businessmodule")
public class OriginalDataAccessConfig {
  private static final Logger log = LoggerFactory.getLogger(ReportExecution.class);

  private List<OriginalDataPermission> originalDataPermissions = Collections.emptyList();

  public Set<String> getBusinessModulesOriginalDataAllowedForCurrentUser() {
    Set<String> allBusinessModules =
        originalDataPermissions.stream()
            .map(OriginalDataPermission::getBusinessModule)
            .collect(Collectors.toSet());

    return allBusinessModules.stream()
        .filter(this::originalDataAllowedForCurrentUser)
        .collect(Collectors.toSet());
  }

  public boolean originalDataAllowedForCurrentUser(String businessModuleName) {
    List<EmployeePermissionRole> permissionRoles =
        getPermissionRolesForOriginalData(businessModuleName);
    return !permissionRoles.isEmpty()
        && permissionRoles.stream().allMatch(CurrentUserHelper::currentUserHasRole);
  }

  private List<EmployeePermissionRole> getPermissionRolesForOriginalData(
      String businessModuleName) {
    return originalDataPermissions.stream()
        .filter(
            originalDataEntry -> businessModuleName.equals(originalDataEntry.getBusinessModule()))
        .map(OriginalDataAccessConfig::mapPermissionRole)
        .toList();
  }

  private static EmployeePermissionRole mapPermissionRole(
      OriginalDataPermission originalDataPermission) {
    try {
      return EmployeePermissionRole.valueOf(originalDataPermission.getPermission());
    } catch (IllegalArgumentException ignored) {
      log.error("Invalid permission role configured: {}", originalDataPermission.getPermission());
      return null;
    }
  }

  public void setOriginalDataPermissions(List<OriginalDataPermission> originalDataPermissions) {
    this.originalDataPermissions = originalDataPermissions;
  }

  public static class OriginalDataPermission {
    @NotBlank private String businessModule;
    @NotBlank private String permission;

    public String getBusinessModule() {
      return businessModule;
    }

    public void setBusinessModule(String businessModule) {
      this.businessModule = businessModule;
    }

    public String getPermission() {
      return permission;
    }

    public void setPermission(String permission) {
      this.permission = permission;
    }
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.config;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.rest.service.security.CurrentUserHelper;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.Map;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "eshg.statistics", ignoreUnknownFields = false)
public record StatisticsConfig(
    @NotNull @Valid BusinessModuleConfig businessModule,
    @DefaultValue @Valid DiagramDataConfig diagramData,
    @DefaultValue @Valid TableRowsConfig tableRows) {

  private static final Logger log = LoggerFactory.getLogger(StatisticsConfig.class);

  public record BusinessModuleConfig(
      @NotEmpty Map<BusinessModule, EmployeePermissionRole> sensitiveDataPermissions,
      @Positive @DefaultValue("500") int pageSize) {

    public BusinessModuleConfig {
      log.debug("sensitiveDataPermissions: {}", sensitiveDataPermissions);
    }

    public Set<String> getBusinessModulesSensitiveDataAllowedForCurrentUser() {
      return sensitiveDataPermissions.entrySet().stream()
          .filter(entry -> currentUserHasRole(entry.getValue()))
          .map(entry -> entry.getKey().name())
          .collect(StreamUtil.toLinkedHashSet());
    }

    public boolean sensitiveDataAllowedForCurrentUser(String businessModuleName) {
      BusinessModule businessModule = BusinessModule.valueOf(businessModuleName);
      EmployeePermissionRole permissionRole = sensitiveDataPermissions.get(businessModule);
      return currentUserHasRole(permissionRole);
    }

    private boolean currentUserHasRole(EmployeePermissionRole permissionRole) {
      return permissionRole != null && CurrentUserHelper.currentUserHasRole(permissionRole);
    }
  }

  public record DiagramDataConfig(@Positive @DefaultValue("500") int pageSize) {}

  public record TableRowsConfig(@Positive @DefaultValue("500") int pageSize) {}
}

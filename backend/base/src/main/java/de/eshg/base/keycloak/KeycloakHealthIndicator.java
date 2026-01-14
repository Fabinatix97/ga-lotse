/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import org.keycloak.representations.info.MemoryInfoRepresentation;
import org.keycloak.representations.info.ServerInfoRepresentation;
import org.keycloak.representations.info.SystemInfoRepresentation;
import org.springframework.boot.actuate.health.AbstractHealthIndicator;
import org.springframework.boot.actuate.health.Health;
import org.springframework.stereotype.Component;

@Component
public class KeycloakHealthIndicator extends AbstractHealthIndicator {

  private final EmployeeKeycloakClient employeeKeycloakClient;

  public KeycloakHealthIndicator(EmployeeKeycloakClient employeeKeycloakClient) {
    this.employeeKeycloakClient = employeeKeycloakClient;
  }

  @Override
  protected void doHealthCheck(Health.Builder builder) throws Exception {
    ServerInfoRepresentation serverInfo = employeeKeycloakClient.getServerInfo();
    SystemInfoRepresentation systemInfo = serverInfo.getSystemInfo();
    builder.withDetail("version", systemInfo.getVersion());
    builder.withDetail("uptime", systemInfo.getUptime());

    MemoryInfoRepresentation memoryInfo = serverInfo.getMemoryInfo();
    long memoryUsagePercentage = 100 - memoryInfo.getFreePercentage();

    builder.withDetail(
        "usedMemory",
        "%s/%s (%d%%)"
            .formatted(
                memoryInfo.getUsedFormated(),
                memoryInfo.getTotalFormated(),
                memoryUsagePercentage));
    builder.up();
  }
}

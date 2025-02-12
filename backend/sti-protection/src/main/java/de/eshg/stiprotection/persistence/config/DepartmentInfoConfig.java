/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.config;

import java.util.HashMap;
import java.util.Map;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "de.eshg.sti-protection")
public class DepartmentInfoConfig {

  private final Map<String, DepartmentInfoProperties> departmentInfo = new HashMap<>();
  private final Map<String, OpeningHoursProperties> openingHours = new HashMap<>();

  public Map<String, DepartmentInfoProperties> getDepartmentInfo() {
    return departmentInfo;
  }

  public Map<String, OpeningHoursProperties> getOpeningHours() {
    return openingHours;
  }
}

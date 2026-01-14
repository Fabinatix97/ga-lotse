/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.config;

import de.eshg.config.initialization.MandatoryInitialOpeningHours;
import de.eshg.config.initialization.OptionalInitialDepartmentInfo;
import java.util.HashMap;
import java.util.Map;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "de.eshg.sti-protection")
public class DepartmentInfoConfig {

  private final Map<String, OptionalInitialDepartmentInfo> departmentInfo = new HashMap<>();
  private final Map<String, MandatoryInitialOpeningHours> openingHours = new HashMap<>();

  public Map<String, OptionalInitialDepartmentInfo> getDepartmentInfo() {
    return departmentInfo;
  }

  public Map<String, MandatoryInitialOpeningHours> getOpeningHours() {
    return openingHours;
  }
}

/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility;

import io.micrometer.common.util.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FacilityFileNumberConfiguration {

  @Value("${de.eshg.inspection.facility-file-number-method}")
  private String methodFromConfig;

  private String method;

  public FacilityFileNumberConfiguration() {
    method = methodFromConfig;
  }

  public void setMethod(String method) {
    this.method = method;
  }

  public String getMethod() {
    return StringUtils.isBlank(method) ? methodFromConfig : method;
  }
}

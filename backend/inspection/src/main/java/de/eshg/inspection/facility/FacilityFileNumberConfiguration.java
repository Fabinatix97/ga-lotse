/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FacilityFileNumberConfiguration {

  @Value("${de.eshg.inspection.facility-file-number-method}")
  private String method;

  public String getMethod() {
    return method;
  }
}

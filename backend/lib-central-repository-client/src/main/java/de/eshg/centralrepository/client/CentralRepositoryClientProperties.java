/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.centralrepository.client;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.centralrepository")
public class CentralRepositoryClientProperties {

  private final String serviceUrl;
  private final String mockCertSubjectCn;

  public CentralRepositoryClientProperties(String serviceUrl, String mockCertSubjectCn) {
    this.serviceUrl = serviceUrl;
    this.mockCertSubjectCn = mockCertSubjectCn;
  }

  public String getServiceUrl() {
    return serviceUrl;
  }

  public String getMockCertSubjectCn() {
    return mockCertSubjectCn;
  }
}

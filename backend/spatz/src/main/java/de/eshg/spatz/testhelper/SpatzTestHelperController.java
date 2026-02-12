/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.testhelper;

import de.eshg.spatz.common.SelfSignedCertService;
import de.eshg.spatz.common.ServiceDirectoryTopologyService;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import io.swagger.v3.oas.annotations.Hidden;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.web.bind.annotation.RestController;

@RestController
@ConditionalOnTestHelperEnabled
@ConditionalOnProperty(name = "eshg.spatz.self-signed.enabled", havingValue = "true")
@Hidden
public class SpatzTestHelperController implements SpatzTestHelperApi {

  private static final Logger log = LoggerFactory.getLogger(SpatzTestHelperController.class);
  private final SelfSignedCertService selfSignedCertService;
  private final ServiceDirectoryTopologyService serviceDirectoryTopologyService;

  public SpatzTestHelperController(
      SelfSignedCertService selfSignedCertService,
      ServiceDirectoryTopologyService serviceDirectoryTopologyService) {
    this.selfSignedCertService = selfSignedCertService;
    this.serviceDirectoryTopologyService = serviceDirectoryTopologyService;
    log.info("Created SpatzTestHelperController");
  }

  @Override
  public void reset() {
    selfSignedCertService.reset();
    serviceDirectoryTopologyService.reset();
  }
}

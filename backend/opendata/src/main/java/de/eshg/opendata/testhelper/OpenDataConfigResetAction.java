/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.testhelper;

import de.eshg.opendata.config.OpenDataConfigService;
import de.eshg.testhelper.TestHelperServiceResetAction;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(60)
public class OpenDataConfigResetAction implements TestHelperServiceResetAction {

  private final OpenDataConfigService openDataConfigService;

  public OpenDataConfigResetAction(OpenDataConfigService openDataConfigService) {
    this.openDataConfigService = openDataConfigService;
  }

  @Override
  public void reset() {
    openDataConfigService.init();
  }
}

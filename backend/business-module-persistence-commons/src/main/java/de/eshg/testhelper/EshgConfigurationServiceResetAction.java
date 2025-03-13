/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

import de.eshg.config.EshgConfigurationService;
import java.util.List;
import org.springframework.core.annotation.Order;

@Order(100)
@ConditionalOnTestHelperEnabled
public class EshgConfigurationServiceResetAction implements TestHelperServiceResetAction {
  private final List<EshgConfigurationService<?>> eshgConfigurationServices;

  public EshgConfigurationServiceResetAction(
      List<EshgConfigurationService<?>> eshgConfigurationServices) {
    this.eshgConfigurationServices = eshgConfigurationServices;
  }

  @Override
  public void reset() {
    eshgConfigurationServices.forEach(EshgConfigurationService::init);
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.testhelper;

import de.eshg.lib.appointmentblock.persistence.CreateAppointmentTypeTask;
import de.eshg.measlesprotection.config.MeaslesProtectionConfigService;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperServiceResetAction;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@ConditionalOnTestHelperEnabled
@Component
@Order(50)
public class MeaslesTestHelperResetAction implements TestHelperServiceResetAction {

  private final CreateAppointmentTypeTask createAppointmentTypeTask;
  private final MeaslesProtectionConfigService measlesProtectionConfigService;

  public MeaslesTestHelperResetAction(
      CreateAppointmentTypeTask createAppointmentTypeTask,
      MeaslesProtectionConfigService measlesProtectionConfigService) {
    this.createAppointmentTypeTask = createAppointmentTypeTask;
    this.measlesProtectionConfigService = measlesProtectionConfigService;
  }

  @Override
  public void reset() {
    createAppointmentTypeTask.createAppointmentTypes();
    measlesProtectionConfigService.init();
  }
}

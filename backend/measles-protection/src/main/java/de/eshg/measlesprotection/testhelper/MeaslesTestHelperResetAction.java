/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.testhelper;

import de.eshg.lib.appointmentblock.persistence.CreateAppointmentTypeTask;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperServiceResetAction;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@ConditionalOnTestHelperEnabled
@Component
@Order(50)
public class MeaslesTestHelperResetAction implements TestHelperServiceResetAction {

  private final CreateAppointmentTypeTask createAppointmentTypeTask;

  public MeaslesTestHelperResetAction(CreateAppointmentTypeTask createAppointmentTypeTask) {
    this.createAppointmentTypeTask = createAppointmentTypeTask;
  }

  @Override
  public void reset() {
    createAppointmentTypeTask.createAppointmentTypes();
  }
}

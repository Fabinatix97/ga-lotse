/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper;

import de.eshg.lib.appointmentblock.persistence.CreateAppointmentTypeTask;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperServiceResetAction;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@ConditionalOnTestHelperEnabled
@Component
@Order(50)
public class OmsTestHelperResetAction implements TestHelperServiceResetAction {

  private final CreateAppointmentTypeTask createAppointmentTypeTask;

  public OmsTestHelperResetAction(CreateAppointmentTypeTask createAppointmentTypeTask) {
    this.createAppointmentTypeTask = createAppointmentTypeTask;
  }

  @Override
  public void reset() {
    createAppointmentTypeTask.createAppointmentTypes();
  }
}

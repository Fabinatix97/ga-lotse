/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper;

import de.eshg.departmentinfo.DepartmentInfoService;
import de.eshg.departmentinfo.OpeningHoursService;
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
  private final DepartmentInfoService departmentInfoService;
  private final OpeningHoursService openingHoursService;

  public OmsTestHelperResetAction(
      CreateAppointmentTypeTask createAppointmentTypeTask,
      DepartmentInfoService departmentInfoService,
      OpeningHoursService openingHoursService) {
    this.createAppointmentTypeTask = createAppointmentTypeTask;
    this.departmentInfoService = departmentInfoService;
    this.openingHoursService = openingHoursService;
  }

  @Override
  public void reset() {
    createAppointmentTypeTask.createAppointmentTypes();
    departmentInfoService.init();
    openingHoursService.init();
  }
}

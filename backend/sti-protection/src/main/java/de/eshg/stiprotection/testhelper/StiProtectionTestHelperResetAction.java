/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.testhelper;

import de.eshg.lib.appointmentblock.persistence.CreateAppointmentTypeTask;
import de.eshg.stiprotection.department.SexWorkDepartmentInfoService;
import de.eshg.stiprotection.department.SexWorkOpeningHoursService;
import de.eshg.stiprotection.department.StiConsultationDepartmentInfoService;
import de.eshg.stiprotection.department.StiConsultationOpeningHoursService;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperServiceResetAction;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@ConditionalOnTestHelperEnabled
@Component
@Order(50)
public class StiProtectionTestHelperResetAction implements TestHelperServiceResetAction {

  private final CreateAppointmentTypeTask createAppointmentTypeTask;
  private final StiConsultationDepartmentInfoService stiConsultationDepartmentInfoService;
  private final SexWorkDepartmentInfoService sexWorkDepartmentInfoService;
  private final StiConsultationOpeningHoursService stiConsultationOpeningHoursService;
  private final SexWorkOpeningHoursService sexWorkOpeningHoursService;

  public StiProtectionTestHelperResetAction(
      CreateAppointmentTypeTask createAppointmentTypeTask,
      StiConsultationDepartmentInfoService stiConsultationDepartmentInfoService,
      SexWorkDepartmentInfoService sexWorkDepartmentInfoService,
      StiConsultationOpeningHoursService stiConsultationOpeningHoursService,
      SexWorkOpeningHoursService sexWorkOpeningHoursService) {
    this.createAppointmentTypeTask = createAppointmentTypeTask;
    this.stiConsultationDepartmentInfoService = stiConsultationDepartmentInfoService;
    this.sexWorkDepartmentInfoService = sexWorkDepartmentInfoService;
    this.stiConsultationOpeningHoursService = stiConsultationOpeningHoursService;
    this.sexWorkOpeningHoursService = sexWorkOpeningHoursService;
  }

  @Override
  public void reset() {
    createAppointmentTypeTask.createAppointmentTypes();
    stiConsultationDepartmentInfoService.init();
    stiConsultationOpeningHoursService.init();
    sexWorkDepartmentInfoService.init();
    sexWorkOpeningHoursService.init();
  }
}

/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.testhelper;

import de.eshg.departmentinfo.DepartmentInfoService;
import de.eshg.departmentinfo.OpeningHoursService;
import de.eshg.lib.appointmentblock.persistence.CreateAppointmentTypeTask;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperServiceResetAction;
import de.eshg.travelmedicine.template.medicalhistorytemplate.persistence.CreateMedicalHistoryTemplateTask;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@ConditionalOnTestHelperEnabled
@Component
@Order(50)
public class TravelMedicineTestHelperResetAction implements TestHelperServiceResetAction {

  private final CreateAppointmentTypeTask createAppointmentTypeTask;
  private final CreateMedicalHistoryTemplateTask createMedicalHistoryTemplateTask;
  private final DepartmentInfoService departmentInfoService;
  private final OpeningHoursService openingHoursService;

  public TravelMedicineTestHelperResetAction(
      CreateAppointmentTypeTask createAppointmentTypeTask,
      CreateMedicalHistoryTemplateTask createMedicalHistoryTemplateTask,
      DepartmentInfoService departmentInfoService,
      OpeningHoursService openingHoursService) {
    this.createAppointmentTypeTask = createAppointmentTypeTask;
    this.createMedicalHistoryTemplateTask = createMedicalHistoryTemplateTask;
    this.departmentInfoService = departmentInfoService;
    this.openingHoursService = openingHoursService;
  }

  @Override
  public void reset() {
    createAppointmentTypeTask.createAppointmentTypes();
    createMedicalHistoryTemplateTask.createMedicalHistoryTemplate();
    departmentInfoService.init();
    openingHoursService.init();
  }
}

/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.testhelper;

import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperServiceResetAction;
import de.eshg.travelmedicine.notification.NotificationConfigService;
import de.eshg.travelmedicine.template.medicalhistorytemplate.persistence.CreateMedicalHistoryTemplateTask;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@ConditionalOnTestHelperEnabled
@Component
@Order(50)
public class TravelMedicineTestHelperResetAction implements TestHelperServiceResetAction {
  private final CreateMedicalHistoryTemplateTask createMedicalHistoryTemplateTask;
  private final NotificationConfigService notificationConfigService;

  public TravelMedicineTestHelperResetAction(
      CreateMedicalHistoryTemplateTask createMedicalHistoryTemplateTask,
      NotificationConfigService notificationConfigService) {
    this.createMedicalHistoryTemplateTask = createMedicalHistoryTemplateTask;
    this.notificationConfigService = notificationConfigService;
  }

  @Override
  public void reset() {
    createMedicalHistoryTemplateTask.createMedicalHistoryTemplate();
    notificationConfigService.init();
  }
}

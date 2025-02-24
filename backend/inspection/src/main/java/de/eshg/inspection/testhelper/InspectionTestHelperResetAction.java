/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testhelper;

import de.eshg.inspection.objecttype.persistence.CreateObjectTypeTask;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperServiceResetAction;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@ConditionalOnTestHelperEnabled
@Component
@Order(50)
public class InspectionTestHelperResetAction implements TestHelperServiceResetAction {
  private final CreateObjectTypeTask createObjectTypeTask;
  private final ChecklistDefinitionTestDataProvider checklistDefinitionTestDataProvider;

  public InspectionTestHelperResetAction(
      CreateObjectTypeTask createObjectTypeTask,
      ChecklistDefinitionTestDataProvider checklistDefinitionTestDataProvider) {
    this.createObjectTypeTask = createObjectTypeTask;
    this.checklistDefinitionTestDataProvider = checklistDefinitionTestDataProvider;
  }

  @Override
  public void reset() {
    createObjectTypeTask.createObjectTypes();
    checklistDefinitionTestDataProvider.clearTestCLDs();
  }
}

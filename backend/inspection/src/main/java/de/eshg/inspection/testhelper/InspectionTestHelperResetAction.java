/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testhelper;

import de.eshg.inspection.objecttype.persistence.CreateObjectTypeHierarchyTask;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperServiceResetAction;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@ConditionalOnTestHelperEnabled
@Component
@Order(50)
public class InspectionTestHelperResetAction implements TestHelperServiceResetAction {
  private final CreateObjectTypeHierarchyTask createObjectTypeHierarchyTask;
  private final ChecklistDefinitionTestDataProvider checklistDefinitionTestDataProvider;

  public InspectionTestHelperResetAction(
      ChecklistDefinitionTestDataProvider checklistDefinitionTestDataProvider,
      CreateObjectTypeHierarchyTask createObjectTypeHierarchyTask) {
    this.checklistDefinitionTestDataProvider = checklistDefinitionTestDataProvider;
    this.createObjectTypeHierarchyTask = createObjectTypeHierarchyTask;
  }

  @Override
  public void reset() {
    createObjectTypeHierarchyTask.createObjectTypeHierarchy();
    checklistDefinitionTestDataProvider.clearTestCLDs();
  }
}

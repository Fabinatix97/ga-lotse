/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testhelper;

import de.eshg.inspection.objecttype.persistence.CreateObjectTypeHierarchyTask;
import de.eshg.inspection.sample.CreateInspectionSampleTemplatesTask;
import de.eshg.inspection.testhelper.api.TeisDataCreationModeDto;
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
  private final TeisDataPopulator teisDataPopulator;

  private TeisDataCreationModeDto teisDataCreationMode = TeisDataCreationModeDto.TEST_DATA;
  private final CreateInspectionSampleTemplatesTask createInspectionSampleTemplatesTask;

  public InspectionTestHelperResetAction(
      ChecklistDefinitionTestDataProvider checklistDefinitionTestDataProvider,
      CreateObjectTypeHierarchyTask createObjectTypeHierarchyTask,
      TeisDataPopulator teisDataPopulator,
      CreateInspectionSampleTemplatesTask createInspectionSampleTemplatesTask) {
    this.checklistDefinitionTestDataProvider = checklistDefinitionTestDataProvider;
    this.createObjectTypeHierarchyTask = createObjectTypeHierarchyTask;
    this.teisDataPopulator = teisDataPopulator;
    this.createInspectionSampleTemplatesTask = createInspectionSampleTemplatesTask;
  }

  public TeisDataCreationModeDto getTeisDataCreationModeDto() {
    return teisDataCreationMode;
  }

  public void setTeisDataCreationModeDto(TeisDataCreationModeDto teisDataCreationModeDto) {
    this.teisDataCreationMode = teisDataCreationModeDto;
  }

  @Override
  public void reset() {
    createObjectTypeHierarchyTask.createObjectTypeHierarchy();
    checklistDefinitionTestDataProvider.clearTestCLDs();
    createInspectionSampleTemplatesTask.deleteTemplates();
    teisDataPopulator.recreateTeisData(teisDataCreationMode);
    createInspectionSampleTemplatesTask.createTemplates();
  }
}

/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testhelper;

import de.eshg.inspection.sample.CreateInspectionSampleTemplatesTask;
import de.eshg.testhelper.population.PopulatorComponent;

@PopulatorComponent
public class SampleTemplatePopulator {
  private final CreateInspectionSampleTemplatesTask createInspectionSampleTemplatesTask;

  public SampleTemplatePopulator(
      CreateInspectionSampleTemplatesTask createInspectionSampleTemplatesTask) {
    this.createInspectionSampleTemplatesTask = createInspectionSampleTemplatesTask;
  }

  public void createSampleTemplates() {
    createInspectionSampleTemplatesTask.createTemplates();
  }

  public void deleteSampleTemplates() {
    createInspectionSampleTemplatesTask.deleteTemplates();
  }
}

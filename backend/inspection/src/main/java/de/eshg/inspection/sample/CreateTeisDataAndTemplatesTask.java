/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample;

import de.eshg.inspection.teis.CreateTeisDataTask;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class CreateTeisDataAndTemplatesTask {

  private final CreateTeisDataTask createTeisDataTask;
  private final CreateInspectionSampleTemplatesTask createInspectionSampleTemplatesTask;

  public CreateTeisDataAndTemplatesTask(
      CreateTeisDataTask createTeisDataTask,
      CreateInspectionSampleTemplatesTask createInspectionSampleTemplatesTask) {
    this.createTeisDataTask = createTeisDataTask;
    this.createInspectionSampleTemplatesTask = createInspectionSampleTemplatesTask;
  }

  @PostConstruct
  void createData() {
    createTeisDataTask.parseXml();
    createInspectionSampleTemplatesTask.createTemplates();
  }
}

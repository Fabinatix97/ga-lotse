/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.testhelper;

import de.eshg.schoolentry.population.CreateLabelsTask;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperServiceResetAction;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@ConditionalOnTestHelperEnabled
@Component
@Order(50)
public class SchoolEntryTestHelperResetAction implements TestHelperServiceResetAction {

  private final CreateLabelsTask createLabelsTask;

  public SchoolEntryTestHelperResetAction(CreateLabelsTask createLabelsTask) {
    this.createLabelsTask = createLabelsTask;
  }

  @Override
  public void reset() {
    createLabelsTask.createLabels();
  }
}

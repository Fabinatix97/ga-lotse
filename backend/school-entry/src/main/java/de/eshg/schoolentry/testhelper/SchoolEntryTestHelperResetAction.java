/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.testhelper;

import de.eshg.schoolentry.SchoolEntryGuard;
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
  private final SchoolEntryGuard schoolEntryGuard;

  public SchoolEntryTestHelperResetAction(
      CreateLabelsTask createLabelsTask, SchoolEntryGuard schoolEntryGuard) {
    this.createLabelsTask = createLabelsTask;
    this.schoolEntryGuard = schoolEntryGuard;
  }

  @Override
  public void reset() {
    createLabelsTask.createLabels();
    schoolEntryGuard.resetRateLimits();
  }
}

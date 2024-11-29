/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import java.util.Objects;

public final class SchoolListRowValues extends SchoolEntryRowValues<SchoolListRowValues> {

  private boolean isEntryLevel;

  private boolean isEarlyExamination;

  public boolean isEntryLevel() {
    return isEntryLevel;
  }

  public void setEntryLevel(boolean entryLevel) {
    isEntryLevel = entryLevel;
  }

  public boolean isEarlyExamination() {
    return isEarlyExamination;
  }

  public void setEarlyExamination(boolean earlyExamination) {
    isEarlyExamination = earlyExamination;
  }

  @Override
  public boolean isDuplicateRow(SchoolListRowValues other) {
    return Objects.equals(this.getChild(), other.getChild());
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.lib.xlsximport.RowValues;
import de.eshg.schoolentry.business.model.ImportChildData;

public abstract class SchoolEntryRowValues extends RowValues {

  private ImportChildData child;

  public ImportChildData getChild() {
    return child;
  }

  public void setChild(ImportChildData child) {
    this.child = child;
  }

  abstract boolean isDuplicateRow(Object other);
}

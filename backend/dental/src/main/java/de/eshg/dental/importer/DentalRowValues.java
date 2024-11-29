/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.importer;

import de.eshg.dental.business.model.ImportChildData;
import de.eshg.lib.xlsximport.RowValues;
import java.util.Objects;

public class DentalRowValues extends RowValues<DentalRowValues> {

  private ImportChildData child;

  public ImportChildData getChild() {
    return child;
  }

  public void setChild(ImportChildData child) {
    this.child = child;
  }

  @Override
  public boolean isDuplicateRow(DentalRowValues other) {
    return Objects.equals(child, other.getChild());
  }
}

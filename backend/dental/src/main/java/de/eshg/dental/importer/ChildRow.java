/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.importer;

import de.eshg.base.centralfile.api.person.PersonKeyAttributes;
import de.eshg.dental.business.model.ImportChildData;
import de.eshg.lib.xlsximport.RowData;
import java.util.Objects;

public class ChildRow extends RowData<ChildRow> {

  private ImportChildData child;

  public ImportChildData getChild() {
    return child;
  }

  public void setChild(ImportChildData child) {
    this.child = child;
  }

  @Override
  public boolean isDuplicateRow(ChildRow other) {
    return Objects.equals(child, other.getChild())
        || Objects.equals(getChildKeyAttributes(), other.getChildKeyAttributes())
            && ((child.address() == null || other.child.address() == null)
                || Objects.equals(child.address(), other.child.address()));
  }

  public PersonKeyAttributes getChildKeyAttributes() {
    return new PersonKeyAttributes(child.firstName(), child.lastName(), child.dateOfBirth());
  }
}

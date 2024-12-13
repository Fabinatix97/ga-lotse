/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.base.centralfile.api.person.PersonKeyAttributes;
import de.eshg.lib.xlsximport.RowData;
import de.eshg.schoolentry.business.model.ImportChildData;
import java.util.Objects;

public abstract class SchoolEntryRow<R extends SchoolEntryRow<R>> extends RowData<R> {

  private ImportChildData child;

  public ImportChildData getChild() {
    return child;
  }

  public void setChild(ImportChildData child) {
    this.child = child;
  }

  public PersonKeyAttributes getChildKeyAttributes() {
    return new PersonKeyAttributes(child.firstName(), child.lastName(), child.dateOfBirth());
  }

  @Override
  public boolean isDuplicateRow(R other) {
    return Objects.equals(this.getChild(), other.getChild());
  }
}

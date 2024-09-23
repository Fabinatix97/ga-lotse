/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.schoolentry.business.model.ImportChildData;
import java.util.UUID;
import org.apache.poi.ss.usermodel.Row;

public abstract sealed class RowValues permits CitizenListRowValues, SchoolListRowValues {
  private Row row;
  private ImportStatus status;
  private UUID procedureId;
  private boolean valid = true;
  private ImportChildData child;

  public Row getRow() {
    return row;
  }

  public void setRow(Row row) {
    this.row = row;
  }

  public ImportStatus getStatus() {
    return status;
  }

  public void setStatus(ImportStatus status) {
    this.status = status;
  }

  public UUID getProcedureId() {
    return procedureId;
  }

  public void setProcedureId(UUID procedureId) {
    this.procedureId = procedureId;
  }

  public boolean isValid() {
    return valid;
  }

  public void foundInvalidData() {
    this.valid = false;
  }

  public ImportChildData getChild() {
    return child;
  }

  public void setChild(ImportChildData child) {
    this.child = child;
  }
}

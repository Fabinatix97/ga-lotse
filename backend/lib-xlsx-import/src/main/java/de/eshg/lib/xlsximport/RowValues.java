/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport;

import java.util.UUID;
import org.apache.poi.ss.usermodel.Row;

public abstract class RowValues<T extends RowValues<T>> {

  private Row row;
  private ImportStatus status;
  private UUID procedureId;
  private boolean valid = true;

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

  public abstract boolean isDuplicateRow(T other);
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport;

import java.util.UUID;
import org.apache.poi.ss.usermodel.Row;

public abstract class RowData<R extends RowData<R>> {

  private Row xlsxRow;
  private ImportStatus status;
  private UUID entityId;
  private boolean valid = true;
  private boolean mergeable = false;

  Row getXlsxRow() {
    return xlsxRow;
  }

  void setXlsxRow(Row xlsxRow) {
    this.xlsxRow = xlsxRow;
  }

  public ImportStatus getStatus() {
    return status;
  }

  public void setStatus(ImportStatus status) {
    this.status = status;
  }

  public UUID getEntityId() {
    return entityId;
  }

  public void setEntityId(UUID entityId) {
    this.entityId = entityId;
  }

  public boolean isValid() {
    return valid;
  }

  public void markAsInvalid() {
    this.valid = false;
  }

  public boolean isMergeable() {
    return mergeable;
  }

  public void markAsMergeable() {
    this.mergeable = true;
  }

  public abstract boolean isDuplicateRow(R other);

  public int getRowNum() {
    return getXlsxRow().getRowNum();
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport;

import java.util.List;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;

public class FeedbackColumnAccessor {

  private final int statusColumn;
  private final int entityIdColumn;
  private final int referenceIdColumn;

  public FeedbackColumnAccessor(List<? extends XlsxColumn> actualColumns) {
    this(actualColumns, XlsxColumn.PROCEDURE_COLUMN_HEADER);
  }

  public FeedbackColumnAccessor(
      List<? extends XlsxColumn> actualColumns, String entityIdColumnHeader) {
    List<String> headers = actualColumns.stream().map(XlsxColumn::getHeader).toList();
    this.statusColumn = headers.indexOf(XlsxColumn.STATUS_COLUMN_HEADER);
    this.entityIdColumn = headers.indexOf(entityIdColumnHeader);
    this.referenceIdColumn = headers.indexOf(XlsxColumn.REFERENCE_COLUMN_HEADER);
  }

  public Cell getStatus(Row row) {
    return getCellNullSafe(row, statusColumn);
  }

  public Cell getEntityId(Row row) {
    return getCellNullSafe(row, entityIdColumn);
  }

  public Cell getReferenceId(Row row) {
    return getCellNullSafe(row, referenceIdColumn);
  }

  private Cell getCellNullSafe(Row row, int col) {
    Cell cell = row.getCell(col);
    if (cell == null) {
      cell = row.createCell(col, CellType.STRING);
    }
    return cell;
  }

  public boolean hasReferenceIdColum() {
    return referenceIdColumn >= 0;
  }
}

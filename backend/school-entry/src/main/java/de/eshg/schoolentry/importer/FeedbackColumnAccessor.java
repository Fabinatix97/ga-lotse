/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import java.util.List;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;

public class FeedbackColumnAccessor {

  private final int statusColumn;
  private final int procedureIdColumn;
  private final int referenceIdColumn;

  FeedbackColumnAccessor(List<? extends XlsxColumn> actualColumns) {
    List<String> headers = actualColumns.stream().map(XlsxColumn::getHeader).toList();
    this.statusColumn = headers.indexOf(XlsxColumn.STATUS_COLUMN_HEADER);
    this.procedureIdColumn = headers.indexOf(XlsxColumn.PROCEDURE_COLUMN_HEADER);
    this.referenceIdColumn = headers.indexOf(XlsxColumn.REFERENCE_COLUMN_HEADER);
  }

  public Cell getStatus(Row row) {
    return getCellNullSafe(row, statusColumn);
  }

  public Cell getProcedureId(Row row) {
    return getCellNullSafe(row, procedureIdColumn);
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

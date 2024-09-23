/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.schoolentry.util.ImportDataUtil;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;

public class ColumnAccessor {

  private final Row row;
  private final int inputColumns;
  private int col;

  public ColumnAccessor(Row row) {
    this.row = row;
    this.inputColumns = ImportDataUtil.computeNumberOfInputColumns(row.getSheet());
  }

  public boolean hasNext() {
    return col < inputColumns;
  }

  public Cell next() {
    return getCellNullSafe(col++);
  }

  public void skip(int numberOfCells) {
    col = col + numberOfCells;
  }

  public int getCurrentColumn() {
    return col;
  }

  public Cell get(int col) {
    return getCellNullSafe(col);
  }

  private Cell getCellNullSafe(int col) {
    Cell cell = row.getCell(col);
    if (cell == null) {
      cell = row.createCell(col);
    }
    return cell;
  }
}

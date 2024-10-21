/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport;

import java.util.List;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.util.Assert;

public class ColumnAccessor<T extends XlsxColumn> {

  private final Row row;
  private final List<T> actualColumns;

  public ColumnAccessor(Row row, List<T> actualColumns) {
    this.row = row;
    this.actualColumns = actualColumns;
  }

  public boolean hasColumn(T col) {
    return actualColumns.contains(col);
  }

  public Cell get(T col) {
    int index = actualColumns.indexOf(col);
    return getCellNullSafe(index);
  }

  private Cell getCellNullSafe(int col) {
    Cell cell = row.getCell(col);
    if (cell == null) {
      cell = row.createCell(col);
    }
    return cell;
  }

  public Stream<Cell> getRange(T start, T end) {
    int startIndex = actualColumns.indexOf(start);
    int endIndex = actualColumns.indexOf(end);
    Assert.isTrue(startIndex >= 0, "Start column must exist");
    Assert.isTrue(endIndex >= 0, "End column must exist");
    Assert.isTrue(endIndex >= startIndex, "Start column must be before end column");
    return IntStream.rangeClosed(startIndex, endIndex).boxed().map(this::getCellNullSafe);
  }
}

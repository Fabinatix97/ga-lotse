/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street.csv;

import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.bean.StatefulBeanToCsvBuilder;
import com.opencsv.exceptions.CsvDataTypeMismatchException;
import com.opencsv.exceptions.CsvRequiredFieldEmptyException;
import de.eshg.base.street.csv.opencsv.CsvBindByNameMappingStrategy;
import de.eshg.base.street.csv.opencsv.CsvWritePositionOrderComparator;
import java.io.*;
import java.util.List;

public class StreetDirectoryEntriesOpenCsvMapper {

  private StreetDirectoryEntriesOpenCsvMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static String beansToCsv(List<StreetDirectoryCsvEntry> beans) {
    StringWriter writer = new StringWriter();
    beansToCsv(beans, writer);
    return writer.toString();
  }

  public static void beansToCsv(List<StreetDirectoryCsvEntry> beans, Writer writer) {
    StatefulBeanToCsv<StreetDirectoryCsvEntry> beanToCsv =
        new StatefulBeanToCsvBuilder<StreetDirectoryCsvEntry>(writer)
            .withApplyQuotesToAll(false)
            .withSeparator(';')
            .withMappingStrategy(newWriteStrategy())
            .build();
    try {
      beanToCsv.write(beans);
    } catch (CsvDataTypeMismatchException | CsvRequiredFieldEmptyException e) {
      throw new IllegalArgumentException("Could not wirte beans to CSV", e);
    }
  }

  private static CsvBindByNameMappingStrategy<StreetDirectoryCsvEntry> newWriteStrategy() {
    CsvBindByNameMappingStrategy<StreetDirectoryCsvEntry> strategy =
        new CsvBindByNameMappingStrategy<>();
    strategy.setType(StreetDirectoryCsvEntry.class);
    strategy.setColumnOrderOnWrite(
        new CsvWritePositionOrderComparator(StreetDirectoryCsvEntry.class));
    return strategy;
  }
}

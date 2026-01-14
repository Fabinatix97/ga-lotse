/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street.csv.opencsv;

import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.bean.StatefulBeanToCsvBuilder;
import com.opencsv.exceptions.CsvDataTypeMismatchException;
import com.opencsv.exceptions.CsvRequiredFieldEmptyException;
import java.io.*;
import java.util.List;

public class BeansToCsvMapper {

  private BeansToCsvMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static <T> String beansToCsv(List<T> beans, Class<T> type) {
    StringWriter writer = new StringWriter();
    beansToCsv(beans, writer, type);
    return writer.toString();
  }

  public static <T> void beansToCsv(List<T> beans, Writer writer, Class<T> type) {
    StatefulBeanToCsv<T> beanToCsv =
        new StatefulBeanToCsvBuilder<T>(writer)
            .withApplyQuotesToAll(false)
            .withSeparator(';')
            .withMappingStrategy(newWriteStrategy(type))
            .build();
    try {
      beanToCsv.write(beans);
    } catch (CsvDataTypeMismatchException | CsvRequiredFieldEmptyException e) {
      throw new IllegalArgumentException("Could not wirte beans to CSV", e);
    }
  }

  private static <T> CsvBindByNameMappingStrategy<T> newWriteStrategy(Class<T> type) {
    CsvBindByNameMappingStrategy<T> strategy = new CsvBindByNameMappingStrategy<>();
    strategy.setType(type);
    strategy.setColumnOrderOnWrite(new CsvWritePositionOrderComparator(type));
    return strategy;
  }
}

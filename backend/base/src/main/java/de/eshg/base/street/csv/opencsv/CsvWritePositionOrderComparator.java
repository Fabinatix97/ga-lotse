/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street.csv.opencsv;

import com.opencsv.bean.CsvBindByName;
import com.opencsv.bean.CsvCustomBindByName;
import java.io.Serial;
import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.Comparator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CsvWritePositionOrderComparator extends OpenCsvFixedOrderComparator {
  @Serial private static final long serialVersionUID = 1L;
  private static final Logger log = LoggerFactory.getLogger(CsvWritePositionOrderComparator.class);

  public CsvWritePositionOrderComparator(Class<?> clazz) {
    super(getOrderByCsvWritePosition(clazz));
  }

  private static String[] getOrderByCsvWritePosition(Class<?> clazz) {
    Field[] fields = clazz.getDeclaredFields();

    return Arrays.stream(fields)
        .filter(field -> field.getAnnotation(CsvWritePosition.class) != null)
        .sorted(
            Comparator.comparingInt(field -> field.getAnnotation(CsvWritePosition.class).value()))
        .map(CsvWritePositionOrderComparator::getCsvBindByName)
        .toArray(String[]::new);
  }

  private static String getCsvBindByName(Field field) {
    log.info("Handling field {}", field.getName());
    CsvBindByName csvBindByName = field.getAnnotation(CsvBindByName.class);
    if (csvBindByName != null) {
      return csvBindByName.column();
    }

    return field.getAnnotation(CsvCustomBindByName.class).column();
  }
}

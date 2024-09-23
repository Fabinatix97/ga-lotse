/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street.csv.opencsv;

import com.opencsv.bean.CsvBindByName;
import com.opencsv.bean.CsvCustomBindByName;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;
import com.opencsv.exceptions.CsvRequiredFieldEmptyException;
import java.lang.reflect.Field;
import java.util.Arrays;

public class CsvBindByNameMappingStrategy<T> extends HeaderColumnNameMappingStrategy<T> {
  @Override
  public String[] generateHeader(T bean) throws CsvRequiredFieldEmptyException {
    super.generateHeader(bean);
    return Arrays.stream(headerIndex.getHeaderIndex())
        .map(header -> getCsvBindByName(fieldMap.get(header).getField()))
        .toArray(String[]::new);
  }

  private static String getCsvBindByName(Field field) {

    CsvBindByName csvBindByName = field.getAnnotation(CsvBindByName.class);
    if (csvBindByName != null) {
      return csvBindByName.column();
    }

    return field.getAnnotation(CsvCustomBindByName.class).column();
  }
}

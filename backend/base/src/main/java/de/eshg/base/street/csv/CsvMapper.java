/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street.csv;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.List;

public final class CsvMapper {

  private CsvMapper() {}

  public static <T> List<T> csvToBeans(byte[] resource, Class<T> clazz) {
    try (BufferedReader reader =
        new BufferedReader(
            new InputStreamReader(new ByteArrayInputStream(resource), StandardCharsets.UTF_8))) {
      return csvToBeans(reader, clazz);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  public static <T> List<T> csvToBeans(File file, Class<T> clazz) throws IOException {
    return csvToBeans(Files.readAllBytes(file.toPath()), clazz);
  }

  public static <T> List<T> csvToBeans(Reader reader, Class<T> clazz) {
    CsvToBean<T> csvToBean = createCsvToBean(reader, clazz);
    return csvToBean.parse();
  }

  private static <T> CsvToBean<T> createCsvToBean(Reader reader, Class<T> clazz) {
    return new CsvToBeanBuilder<T>(reader).withType(clazz).withSeparator(';').build();
  }
}

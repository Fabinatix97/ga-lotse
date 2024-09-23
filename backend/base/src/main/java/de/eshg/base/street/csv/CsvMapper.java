/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street.csv;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.Reader;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.util.List;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

public class CsvMapper {

  public static <T> List<T> csvToBeans(Resource resource, Class<T> clazz) {
    try (BufferedReader reader = Files.newBufferedReader(resource.getFile().toPath())) {
      return csvToBeans(reader, clazz);
    } catch (IOException e) {
      throw new UncheckedIOException(
          "Could not parse CSV file '%s".formatted(resource.getFilename()), e);
    }
  }

  public static <T> List<T> csvToBeans(File file, Class<T> clazz) {
    return csvToBeans(new FileSystemResource(file), clazz);
  }

  public static <T> List<T> csvToBeans(Reader reader, Class<T> clazz) {
    CsvToBean<T> csvToBean = createCsvToBean(reader, clazz);
    return csvToBean.parse();
  }

  private static <T> CsvToBean<T> createCsvToBean(Reader reader, Class<T> clazz) {
    return new CsvToBeanBuilder<T>(reader).withType(clazz).withSeparator(';').build();
  }
}

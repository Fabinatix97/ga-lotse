/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street;

import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;

public class StreetDirectoryConfig {
  private static final Logger log = LoggerFactory.getLogger(StreetDirectoryConfig.class);

  private StreetDirectoryConfig() {
    throw new IllegalStateException("Utility class");
  }

  private static File getFromClasspath(String filename) {
    try {
      return new ClassPathResource(filename).getFile();
    } catch (IOException e) {
      throw new UncheckedIOException(
          "Could not load file '%s' from classpath".formatted(filename), e);
    }
  }

  public static File csvFile() {
    return getFromClasspath("strassenverzeichnis2022.csv");
  }
}

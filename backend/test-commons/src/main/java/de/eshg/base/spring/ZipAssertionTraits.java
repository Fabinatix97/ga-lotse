/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.spring;

import de.cronn.assertions.validationfile.FileExtensions;
import de.cronn.assertions.validationfile.junit5.JUnit5ValidationFileAssertions;
import de.cronn.assertions.validationfile.normalization.ValidationNormalizer;
import java.io.IOException;
import java.io.InputStream;
import java.util.StringJoiner;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import org.springframework.core.io.Resource;

public interface ZipAssertionTraits extends JUnit5ValidationFileAssertions {

  default void assertZipWithFile(Resource zipFile, ValidationNormalizer normalizer)
      throws IOException {
    StringJoiner joiner = new StringJoiner(System.lineSeparator());
    try (InputStream inputStream = zipFile.getInputStream();
        ZipInputStream zipInputStream = new ZipInputStream(inputStream)) {
      ZipEntry zipEntry;
      while ((zipEntry = zipInputStream.getNextEntry()) != null) {
        joiner.add(zipEntry.getName());
      }
    }
    assertWithFileWithSuffix(joiner.toString(), normalizer, "zip", FileExtensions.TXT);
  }

  default void assertZipWithFile(Resource zipFile) throws IOException {
    assertZipWithFile(zipFile, null);
  }
}

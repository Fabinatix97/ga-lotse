/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.domain.model.serialization;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import org.apache.commons.io.FilenameUtils;

public class ZipFileWrapper {
  private final Map<String, byte[]> entries = new LinkedHashMap<>();

  public String getCollisionFreeFileName(String originalFileName) {
    int number = 0;
    while (entries.containsKey(withNumber(originalFileName, number))) {
      number = number + 1;
    }
    return withNumber(originalFileName, number);
  }

  public void addEntry(String fileName, byte[] content) {
    Object existingEntry = entries.putIfAbsent(fileName, content);
    if (existingEntry != null) {
      throw new IllegalArgumentException("FileName " + fileName + " already exists");
    }
  }

  public void removeEntry(String fileName) {
    if (!entries.containsKey(fileName)) {
      throw new IllegalArgumentException("FileName " + fileName + " not found");
    }
    entries.remove(fileName);
  }

  public Set<String> getFileNames() {
    return entries.keySet();
  }

  public byte[] asByteArray() {
    try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()) {
      try (ZipOutputStream zipOutputStream = new ZipOutputStream(byteArrayOutputStream)) {
        for (Entry<String, byte[]> file : entries.entrySet()) {
          zipOutputStream.putNextEntry(new ZipEntry(file.getKey()));
          zipOutputStream.write(file.getValue());
          zipOutputStream.closeEntry();
        }
      }

      return byteArrayOutputStream.toByteArray();
    } catch (IOException e) {
      throw new UncheckedIOException("Error during creating zip file", e);
    }
  }

  private String withNumber(String fileName, int number) {
    if (number <= 0) {
      return fileName;
    }
    if (fileName.contains(FilenameUtils.EXTENSION_SEPARATOR_STR)) {
      return FilenameUtils.removeExtension(fileName)
          + "_"
          + number
          + FilenameUtils.EXTENSION_SEPARATOR_STR
          + FilenameUtils.getExtension(fileName);
    } else {
      return fileName + "_" + number;
    }
  }
}

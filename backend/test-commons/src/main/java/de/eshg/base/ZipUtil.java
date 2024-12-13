/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base;

import de.cronn.assertions.validationfile.normalization.ValidationNormalizer;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HexFormat;
import java.util.List;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.exception.UncheckedException;

public class ZipUtil {

  private ZipUtil() {}

  public static byte[] extractZipEntry(String internalPath, byte[] content) {
    try (ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(content);
        ZipInputStream zipInputStream = new ZipInputStream(byteArrayInputStream)) {
      for (ZipEntry zipEntry = zipInputStream.getNextEntry();
          zipEntry != null;
          zipEntry = zipInputStream.getNextEntry()) {
        if (internalPath.equals(zipEntry.getName())) {
          return zipInputStream.readAllBytes();
        }
      }
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
    return new byte[0];
  }

  public static String listZipContent(byte[] content) {
    return listZipContent(content, Collections.emptyList());
  }

  public static String listZipContent(byte[] content, ValidationNormalizer normalizer) {
    return listZipContent(content, Collections.singletonList(normalizer));
  }

  public static String listZipContent(byte[] content, List<ValidationNormalizer> normalizers) {
    List<String> results = new ArrayList<>();
    try (ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(content);
        ZipInputStream zipInputStream = new ZipInputStream(byteArrayInputStream)) {
      for (ZipEntry zipEntry = zipInputStream.getNextEntry();
          zipEntry != null;
          zipEntry = zipInputStream.getNextEntry()) {
        results.add(stringifyZipEntry(zipEntry, zipInputStream.readAllBytes(), normalizers));
      }
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
    return results.stream()
        .map(String::stripTrailing)
        .collect(Collectors.joining(System.lineSeparator()));
  }

  private static String stringifyZipEntry(
      ZipEntry zipEntry, byte[] zipEntryContent, List<ValidationNormalizer> normalizers) {
    String fileName = applyReplacers(zipEntry.getName(), normalizers);
    if (!zipEntry.isDirectory()) {
      if (zipEntry.getName().endsWith(".zip")) {
        return fileName
            + ":"
            + System.lineSeparator()
            + listZipContent(zipEntryContent, normalizers).indent(4);
      } else if (isTextFile(zipEntry.getName())) {
        return fileName
            + ":"
            + System.lineSeparator()
            + applyReplacers(new String(zipEntryContent), normalizers).indent(4);
      } else {
        return fileName + " [" + hashOf(zipEntryContent) + "]";
      }
    }
    return fileName;
  }

  private static boolean isTextFile(String fileName) {
    return FilenameUtils.isExtension(fileName, "txt", "csv");
  }

  private static String hashOf(byte[] content) {
    try {
      return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(content));
    } catch (NoSuchAlgorithmException e) {
      throw new UncheckedException(e);
    }
  }

  private static String applyReplacers(String source, List<ValidationNormalizer> normalizers) {
    for (ValidationNormalizer normalizer : normalizers) {
      source = normalizer.normalize(source);
    }
    return source;
  }
}

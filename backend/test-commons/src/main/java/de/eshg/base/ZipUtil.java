/*
 * Copyright 2025 cronn GmbH
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

  private static final int MAX_ENTRIES = 1_000;
  private static final int MAX_BYTES = 1_000_000;

  public static final String TOO_MANY_ZIP_ENTRIES = "Too many ZIP entries";
  public static final String EXPANDED_CONTENT_TOO_LARGE = "Expanded content too large";

  private ZipUtil() {}

  public static byte[] extractZipEntry(String internalPath, byte[] content) {
    try (ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(content);
        ZipInputStream zipInputStream = new ZipInputStream(byteArrayInputStream)) {
      for (int numberOfEntries = 0; numberOfEntries < MAX_ENTRIES; numberOfEntries++) {
        ZipEntry zipEntry = zipInputStream.getNextEntry();
        if (zipEntry == null) {
          return new byte[0];
        }
        if (internalPath.equals(zipEntry.getName())) {
          return readBytes(zipInputStream);
        }
      }
      throw new IllegalStateException(TOO_MANY_ZIP_ENTRIES);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  public static List<String> listZipEntries(byte[] content) {
    try (ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(content);
        ZipInputStream zipInputStream = new ZipInputStream(byteArrayInputStream)) {
      List<String> zipEntries = new ArrayList<>();
      for (int numberOfEntries = 0; numberOfEntries < MAX_ENTRIES; numberOfEntries++) {
        ZipEntry zipEntry = zipInputStream.getNextEntry();
        if (zipEntry == null) {
          return zipEntries;
        }
        zipEntries.add(zipEntry.getName());
      }
      throw new IllegalStateException(TOO_MANY_ZIP_ENTRIES);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  public static String listZipContent(byte[] content) {
    return listZipContent(content, Collections.emptyList());
  }

  public static String listZipContent(byte[] content, ValidationNormalizer normalizer) {
    return listZipContent(content, Collections.singletonList(normalizer));
  }

  public static String listZipContent(byte[] content, List<ValidationNormalizer> normalizers) {
    long totalSize = 0;
    List<String> results = new ArrayList<>();
    try (ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(content);
        ZipInputStream zipInputStream = new ZipInputStream(byteArrayInputStream)) {
      for (int numberOfEntries = 0; numberOfEntries < MAX_ENTRIES; numberOfEntries++) {
        ZipEntry zipEntry = zipInputStream.getNextEntry();
        if (zipEntry == null) {
          return results.stream()
              .map(String::stripTrailing)
              .collect(Collectors.joining(System.lineSeparator()));
        }
        byte[] entryContent = readBytes(zipInputStream);
        totalSize += entryContent.length;
        if (totalSize > MAX_BYTES) {
          throw new IllegalStateException(EXPANDED_CONTENT_TOO_LARGE);
        }
        results.add(stringifyZipEntry(zipEntry, entryContent, normalizers));
      }
      throw new IllegalStateException(TOO_MANY_ZIP_ENTRIES);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
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

  private static byte[] readBytes(ZipInputStream zipInputStream) throws IOException {
    byte[] result = zipInputStream.readNBytes(MAX_BYTES);
    if (zipInputStream.readNBytes(1).length > 0) {
      throw new IllegalArgumentException(EXPANDED_CONTENT_TOO_LARGE);
    }
    return result;
  }
}

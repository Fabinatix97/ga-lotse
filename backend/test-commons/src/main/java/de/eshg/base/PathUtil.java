/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base;

import de.cronn.assertions.validationfile.normalization.SimpleRegexReplacement;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

public class PathUtil {

  private PathUtil() {}

  public static String listDirectoryContent(Path path, SimpleRegexReplacement normalizer) {
    try (Stream<Path> files = Files.walk(path)) {
      return files
          .map(path::relativize)
          .map(PathUtil::stringify)
          .map(normalizer::normalize)
          .sorted()
          .collect(Collectors.joining("\r\n"));
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  public static String listDirectoryAndFileContent(Path path) {
    try (Stream<Path> files = Files.walk(path)) {
      return files
          .sorted(Comparator.comparing(Path::toString))
          .map(file -> stringifyFile(stringify(path.relativize(file)), file))
          .collect(Collectors.joining("\r\n"));
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  private static String stringify(Path path) {
    return StreamSupport.stream(path.spliterator(), false)
        .map(Path::toString)
        .collect(Collectors.joining("/"));
  }

  private static String stringifyFile(String normalizedFilename, Path path) {
    StringBuilder sb = new StringBuilder(normalizedFilename);
    if (Files.isDirectory(path)) {
      sb.append("  [DIRECTORY]\r\n");
    } else {
      sb.append("\r\n");
      try {
        sb.append(Files.readString(path).indent(4));
      } catch (IOException e) {
        throw new UncheckedIOException(e);
      }
    }
    return sb.toString();
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;

public final class TempDirUtil {

  private TempDirUtil() {}

  public static Path getTempDirOrThrow() {
    try {
      Path tempDirectory = Files.createTempDirectory("tmp-");
      tempDirectory.toFile().deleteOnExit();
      return tempDirectory;
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }
}

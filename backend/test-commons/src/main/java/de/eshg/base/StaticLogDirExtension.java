/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.nio.file.Path;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.extension.BeforeEachCallback;
import org.junit.jupiter.api.extension.ExtensionContext;

public class StaticLogDirExtension implements BeforeEachCallback {

  private final Path logOutputDir = TempDirUtil.getTempDirOrThrow();

  @Override
  public void beforeEach(ExtensionContext context) throws IOException {
    FileUtils.cleanDirectory(logOutputDir.toFile());
    assertThat(logOutputDir).isEmptyDirectory();
  }

  public Path toPath() {
    return logOutputDir;
  }

  public Path toAbsolutePath() {
    return logOutputDir.toAbsolutePath();
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg;

import de.cronn.postgres.snapshot.util.PostgresDump;
import de.cronn.postgres.snapshot.util.PostgresDumpFormat;
import de.cronn.postgres.snapshot.util.PostgresDumpOption;
import de.eshg.testhelper.api.TestHelperDatabaseConnectionDetailsResponse;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public interface MigrationIntegrationTestTraits {

  /*
   * Although this method is currently unused, it must NOT be removed,
   * as it will be needed for future migration tests.
   * It is temporarily used for dumping database states while writing new tests.
   *
   * It is annotated with @SuppressWarnings("unused") to prevent warnings.
   */
  @SuppressWarnings("unused")
  default void dumpDatabaseSnapshot(
      String moduleName, TestHelperDatabaseConnectionDetailsResponse databaseConnectionDetails)
      throws Exception {
    Path databaseSnapshotFile = getDatabaseSnapshotFile(moduleName);
    Files.createDirectories(databaseSnapshotFile.getParent());
    PostgresDump.dumpToFile(
        databaseSnapshotFile,
        databaseConnectionDetails.jdbcUrl(),
        databaseConnectionDetails.username(),
        databaseConnectionDetails.password(),
        PostgresDumpFormat.PLAIN_TEXT,
        PostgresDumpOption.CREATE,
        PostgresDumpOption.INSERTS,
        PostgresDumpOption.NO_OWNER,
        PostgresDumpOption.NO_PRIVILEGES);
  }

  default String readDatabaseSnapshot(String moduleName) throws IOException {
    return Files.readString(getDatabaseSnapshotFile(moduleName), PostgresDump.ENCODING);
  }

  default Path getDatabaseSnapshotFile(String moduleName) {
    return Path.of("src/test/resources", getTestName(), moduleName + ".sql");
  }

  String getTestName();
}

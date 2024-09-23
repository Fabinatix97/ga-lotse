/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base;

import de.cronn.postgres.snapshot.util.PostgresDump;
import de.cronn.postgres.snapshot.util.PostgresDumpOption;

public final class PostgresSchemaDumpUtil {

  private PostgresSchemaDumpUtil() {}

  public static String dumpDatabaseSchema(String jdbcUrl, String username, String password) {
    String schemaDump =
        PostgresDump.dumpToString(
            jdbcUrl,
            username,
            password,
            PostgresDumpOption.SCHEMA_ONLY,
            PostgresDumpOption.NO_COMMENTS);
    return maskPostgresVersion(schemaDump);
  }

  private static String maskPostgresVersion(String source) {
    return source
        .replaceAll("Dumped from database version .+", "Dumped from database version [masked]")
        .replaceAll("Dumped by pg_dump version .+", "Dumped by pg_dump version [masked]");
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.persistence;

import java.sql.Connection;
import java.sql.SQLException;
import javax.sql.DataSource;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.PropertySource;

/** AutoConfiguration to inject the {@link EshgPostgreSQLDialect} by default */
@AutoConfiguration
@PropertySource("classpath:/common-persistence.properties")
class EshgJpaAutoConfiguration {

  EshgJpaAutoConfiguration(DataSource dataSource) throws SQLException {
    assertDatabaseIsPostgres(dataSource);
  }

  private void assertDatabaseIsPostgres(DataSource dataSource) throws SQLException {
    String databaseProductName = determineDatabaseProductName(dataSource);
    if (!databaseProductName.equals("PostgreSQL")) {
      throw new IllegalArgumentException(
          "Unexpected database: "
              + databaseProductName
              + ". We currently support only PostgreSQL.");
    }
  }

  private String determineDatabaseProductName(DataSource dataSource) throws SQLException {
    try (Connection connection = dataSource.getConnection()) {
      return connection.getMetaData().getDatabaseProductName();
    }
  }
}

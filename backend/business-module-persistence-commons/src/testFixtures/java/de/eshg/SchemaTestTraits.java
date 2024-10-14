/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg;

import de.cronn.assertions.validationfile.FileExtensions;
import de.cronn.assertions.validationfile.junit5.JUnit5ValidationFileAssertions;
import de.eshg.base.PostgresSchemaDumpUtil;
import org.springframework.boot.autoconfigure.jdbc.JdbcConnectionDetails;

public interface SchemaTestTraits extends JUnit5ValidationFileAssertions {

  default void schemaExport(JdbcConnectionDetails jdbcConnectionDetails) throws Exception {
    String schema =
        PostgresSchemaDumpUtil.dumpDatabaseSchema(
            jdbcConnectionDetails.getJdbcUrl(),
            jdbcConnectionDetails.getUsername(),
            jdbcConnectionDetails.getPassword());

    assertWithFile(schema, FileExtensions.SQL);
  }
}

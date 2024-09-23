/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.persistence;

import org.hibernate.dialect.PostgreSQLDialect;
import org.hibernate.engine.jdbc.Size;
import org.hibernate.type.SqlTypes;

/**
 * Dialect that overwrites the Hibernate default for String columns of "varchar(255)" with the
 * unlimited "varchar"
 */
public class EshgPostgreSQLDialect extends PostgreSQLDialect {

  @Override
  public SizeStrategy getSizeStrategy() {
    SizeStrategy sizeStrategy = super.getSizeStrategy();
    return (jdbcType, javaType, precision, scale, length) -> {
      int ddlTypeCode = jdbcType.getDdlTypeCode();
      if (ddlTypeCode == SqlTypes.VARCHAR && (length == null || length == Size.DEFAULT_LENGTH)) {
        return new Size();
      }
      return sizeStrategy.resolveSize(jdbcType, javaType, precision, scale, length);
    };
  }
}

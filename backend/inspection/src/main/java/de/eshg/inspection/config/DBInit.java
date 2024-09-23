/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.config;

import jakarta.annotation.PostConstruct;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Temporary workaround for not having Liquibase yet: this bean creates the ShedLock table.
 *
 * @see <a href="https://github.com/lukas-krecan/ShedLock">ShedLock</a>
 */
@Component
public class DBInit {

  private final JdbcTemplate jdbcTemplate;

  public DBInit(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  @PostConstruct
  public void createShedLockTable() {
    // see https://github.com/lukas-krecan/ShedLock?tab=readme-ov-file#configure-lockprovider
    jdbcTemplate.execute(
        """
            CREATE TABLE IF NOT EXISTS shedlock(
              name VARCHAR(64) NOT NULL,
              lock_until TIMESTAMP NOT NULL,
              locked_at TIMESTAMP NOT NULL,
              locked_by VARCHAR(255) NOT NULL,
              PRIMARY KEY (name));
            """);
  }
}

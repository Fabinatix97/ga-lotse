/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

import com.zaxxer.hikari.HikariDataSource;
import com.zaxxer.hikari.HikariPoolMXBean;
import de.cronn.reflection.util.PropertyUtils;
import de.eshg.testhelper.environment.EnvironmentConfig;
import jakarta.persistence.EntityManagerFactory;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import javax.sql.DataSource;
import liquibase.Scope;
import liquibase.integration.spring.SpringLiquibase;
import org.hibernate.SessionFactory;
import org.hibernate.engine.spi.SessionFactoryImplementor;
import org.hibernate.generator.Generator;
import org.hibernate.id.enhanced.PooledOptimizer;
import org.hibernate.id.enhanced.SequenceStyleGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.jdbc.JdbcConnectionDetails;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

@Component
@ConditionalOnBean(DataSource.class)
@ConditionalOnTestHelperEnabled
public class DatabaseResetHelper {

  private final JdbcConnectionDetails jdbcConnectionDetails;
  private final DataSource dataSource;
  private final SpringLiquibase liquibase;
  private final LiquibaseProperties liquibaseProperties;
  private final JdbcTemplate jdbcTemplate;
  private final EntityManagerFactory entityManagerFactory;
  private final EnvironmentConfig environmentConfig;

  public DatabaseResetHelper(
      JdbcConnectionDetails jdbcConnectionDetails,
      DataSource dataSource,
      @Autowired(required = false) SpringLiquibase liquibase,
      @Autowired(required = false) LiquibaseProperties liquibaseProperties,
      JdbcTemplate jdbcTemplate,
      EntityManagerFactory entityManagerFactory,
      EnvironmentConfig environmentConfig) {
    environmentConfig.assertIsNotProduction();
    this.jdbcConnectionDetails = jdbcConnectionDetails;
    this.dataSource = dataSource;
    this.liquibase = liquibase;
    this.liquibaseProperties = liquibaseProperties;
    this.jdbcTemplate = jdbcTemplate;
    this.entityManagerFactory = entityManagerFactory;
    this.environmentConfig = environmentConfig;
  }

  public JdbcConnectionDetails getJdbcConnectionDetails() {
    environmentConfig.assertIsNotProduction();
    return this.jdbcConnectionDetails;
  }

  public void restoreDatabaseSnapshot(String databaseSnapshotSql) throws Exception {
    environmentConfig.assertIsNotProduction();

    Assert.isTrue(
        isLiquibaseAvailableAndEnabled(),
        "Liquibase must be available and enabled in order to restore a database snapshot.");

    dropAndRecreateThePublicSchema();

    String filteredSql =
        Arrays.stream(databaseSnapshotSql.split("\\r?\\n"))
            .filter(line -> !line.isBlank())
            .filter(line -> !line.trim().startsWith("--"))
            .filter(line -> !line.trim().startsWith("\\connect"))
            .filter(line -> !line.trim().toLowerCase(Locale.ROOT).startsWith("create database"))
            .filter(
                line -> !line.trim().toLowerCase(Locale.ROOT).startsWith("create schema public"))
            .collect(Collectors.joining("\n"));
    jdbcTemplate.execute(filteredSql);

    /*
     * We need to evict all connection because after dropping and recreating the public schema,
     * Liquibase would fail when running with old connections:
     *
     * Caused by: liquibase.exception.DatabaseException: ERROR: no schema has been selected to create in
     *   Position: 14 [Failed SQL: (0) CREATE TABLE databasechangelog (ID VARCHAR(255) NOT NULL, AUTHOR VARCHAR(255) NOT NULL, FILENAME VARCHAR(255) NOT NULL, DATEEXECUTED TIMESTAMP WITHOUT TIME ZONE NOT NULL, ORDEREXECUTED INTEGER NOT NULL, EXECTYPE VARCHAR(10) NOT NULL, MD5SUM VARCHAR(35), DESCRIPTION VARCHAR(255), COMMENTS VARCHAR(255), TAG VARCHAR(255), LIQUIBASE VARCHAR(20), CONTEXTS VARCHAR(255), LABELS VARCHAR(255), DEPLOYMENT_ID VARCHAR(10))]
     *    at […]
     * Caused by: org.postgresql.util.PSQLException: ERROR: no schema has been selected to create in
     */
    evictAllConnections();

    runLiquibaseMigrations();
  }

  private void runLiquibaseMigrations() throws Exception {
    // This is a workaround to force Liquibase to clear all internal thread-local caches.
    // If we do not clear them, we observe that Liquibase sometimes incorrectly assumes that no
    // migrations need to run.
    Scope.setScopeManager(null);

    liquibase.afterPropertiesSet();
  }

  private boolean isLiquibaseAvailableAndEnabled() {
    return liquibaseProperties != null && liquibaseProperties.isEnabled() && liquibase != null;
  }

  private void dropAndRecreateThePublicSchema() {
    List<String> extensions =
        jdbcTemplate.query(
            """
            SELECT extname FROM pg_extension
            WHERE extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
            ORDER BY extname""",
            (rs, rowNum) -> rs.getString(1));

    jdbcTemplate.execute("drop schema public cascade");
    jdbcTemplate.execute("create schema public");

    if (!extensions.isEmpty()) {
      String createExtensions =
          extensions.stream()
              .map("create extension %s schema public"::formatted)
              .collect(Collectors.joining(";\n"));
      jdbcTemplate.execute(createExtensions);
    }
  }

  private void evictAllConnections() throws Exception {
    assertNoActiveConnections();
    getHikariPoolMXBean().softEvictConnections();
  }

  private void assertNoActiveConnections() throws Exception {
    int activeConnections = getHikariPoolMXBean().getActiveConnections();
    Assert.isTrue(
        activeConnections == 0,
        ("No active database connections are expected at this point, but found %d active connections. "
                + "This may indicate that a previous test did not complete fully, or that a wait is missing.")
            .formatted(activeConnections));
  }

  private HikariPoolMXBean getHikariPoolMXBean() throws Exception {
    HikariDataSource hikariDataSource = getHikariDataSource();
    return hikariDataSource.getHikariPoolMXBean();
  }

  private HikariDataSource getHikariDataSource() throws Exception {
    if (dataSource instanceof HikariDataSource hikariDataSource) {
      return hikariDataSource;
    }
    return (HikariDataSource)
        dataSource.getClass().getMethod("getRealDataSource").invoke(dataSource);
  }

  private void truncateTablesCascade(List<String> tableNamesToTruncate) {
    String tableNames = String.join(", ", tableNamesToTruncate);
    jdbcTemplate.execute("TRUNCATE TABLE " + tableNames + " RESTART IDENTITY CASCADE");
  }

  private List<String> getAllTableNames(String... tablesToExclude) throws SQLException {
    List<String> tableNames = new ArrayList<>();

    Connection connection = DataSourceUtils.getConnection(dataSource);
    try (ResultSet tables =
        connection.getMetaData().getTables(null, "public", "%", new String[] {"TABLE"})) {
      while (tables.next()) {
        String tableName = tables.getString("TABLE_NAME");
        if (!tableName.toLowerCase(Locale.ROOT).startsWith("databasechangelog")) {
          tableNames.add(tableName);
        }
      }
    } finally {
      DataSourceUtils.releaseConnection(connection, dataSource);
    }

    for (String tableToExclude : tablesToExclude) {
      if (!tableNames.remove(tableToExclude)) {
        throw new IllegalArgumentException("Table '" + tableToExclude + "' not found");
      }
    }

    Assert.isTrue(!tableNames.isEmpty(), "Found no tables");
    return tableNames.stream().sorted().toList();
  }

  @Transactional
  public void truncateAllTables(String... tablesToExclude) throws SQLException {
    environmentConfig.assertIsNotProduction();
    List<String> tableNames = getAllTableNames(tablesToExclude);
    truncateTablesCascade(tableNames);
  }

  @Transactional
  public void resetAllSequences() {
    environmentConfig.assertIsNotProduction();
    List<String> sequenceNamesToReset;
    sequenceNamesToReset = getSequenceNamesThatNeedToBeReset();
    for (String sequenceName : sequenceNamesToReset) {
      resetSequence(sequenceName);
    }

    if (!sequenceNamesToReset.isEmpty()) {
      resetHibernateSequenceGeneratorStates();
    }
  }

  /*
   * Resets Hibernate's sequence ID generators to synchronize with the database sequence.
   *
   * <p>When the database sequence is modified externally, Hibernate's cached ID generators
   * may become out of sync, leading to issues like duplicate key errors or negative IDs.
   * This method resets the internal state of the sequence generators,
   * ensuring Hibernate fetches the next sequence values from the database.
   *
   * <p><strong>Note:</strong> This method accesses internal Hibernate APIs and private fields.
   * Use with caution and test thoroughly when upgrading Hibernate versions.
   *
   * <p>If maintaining this reset becomes too burdensome, we could consider alternative approaches:
   * <ul>
   *   <li>Avoid capturing SQL queries in tests that involve batched inserts.</li>
   *   <li>Reset the sequences to a specific offset, allowing us to identify and filter all IDs
   *       generated from sequenced entities. For example, we could reset the sequences to start at
   *       123_456_000_000 and then match all numbers using the pattern <code>1234560\\d{5}</code>.</li>
   * </ul>
   */
  private void resetHibernateSequenceGeneratorStates() {
    SessionFactory sessionFactory = entityManagerFactory.unwrap(SessionFactory.class);
    SessionFactoryImplementor sessionFactoryImplementor =
        (SessionFactoryImplementor) sessionFactory.getCache().getSessionFactory();
    sessionFactoryImplementor
        .getMappingMetamodel()
        .streamEntityDescriptors()
        .forEach(
            entityPersister -> {
              Generator generator = entityPersister.getGenerator();
              if (generator instanceof SequenceStyleGenerator sequenceStyleGenerator) {
                resetInternalOptimizerState(sequenceStyleGenerator);
              }
            });
  }

  private static void resetInternalOptimizerState(SequenceStyleGenerator sequenceStyleGenerator) {
    PooledOptimizer optimizer = (PooledOptimizer) sequenceStyleGenerator.getOptimizer();
    String privateFieldName = "noTenantState";
    Object noTenantState = PropertyUtils.readDirectly(optimizer, privateFieldName);
    if (noTenantState != null) {
      PropertyUtils.writeDirectly(optimizer, privateFieldName, null);
    }
  }

  private List<String> getSequenceNamesThatNeedToBeReset() {
    return jdbcTemplate.query(
        "select sequencename from pg_sequences where last_value is not null",
        (rs, rowNum) -> rs.getString(1));
  }

  private void resetSequence(String sequenceName) {
    jdbcTemplate.execute("alter sequence " + sequenceName + " restart with 1");
  }
}

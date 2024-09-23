/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

import de.cronn.reflection.util.PropertyUtils;
import jakarta.persistence.EntityManagerFactory;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import javax.sql.DataSource;
import org.hibernate.SessionFactory;
import org.hibernate.engine.spi.SessionFactoryImplementor;
import org.hibernate.generator.Generator;
import org.hibernate.id.enhanced.PooledOptimizer;
import org.hibernate.id.enhanced.SequenceStyleGenerator;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
@ConditionalOnBean(DataSource.class)
@ConditionalOnTestHelperEnabled
public class DatabaseResetHelper {

  private final DataSource dataSource;
  private final EntityManagerFactory entityManagerFactory;

  public DatabaseResetHelper(DataSource dataSource, EntityManagerFactory entityManagerFactory) {
    this.dataSource = dataSource;
    this.entityManagerFactory = entityManagerFactory;
  }

  private static void truncateTablesCascade(
      Connection connection, List<String> tableNamesToTruncate) throws SQLException {
    String tableNames = String.join(", ", tableNamesToTruncate);
    try (PreparedStatement preparedStatement =
        connection.prepareStatement("TRUNCATE TABLE " + tableNames + " RESTART IDENTITY CASCADE")) {
      preparedStatement.execute();
    }
  }

  private static List<String> getAllTableNames(Connection connection, String... tablesToExclude)
      throws SQLException {
    List<String> tableNames = new ArrayList<>();
    try (ResultSet tables =
        connection.getMetaData().getTables(null, "public", "%", new String[] {"TABLE"})) {
      while (tables.next()) {
        String tableName = tables.getString("TABLE_NAME");
        if (!tableName.toLowerCase(Locale.ROOT).startsWith("databasechangelog")) {
          tableNames.add(tableName);
        }
      }
    }

    for (String tableToExclude : tablesToExclude) {
      if (!tableNames.remove(tableToExclude)) {
        throw new IllegalArgumentException("Table '" + tableToExclude + "' not found");
      }
    }

    Assert.isTrue(!tableNames.isEmpty(), "Found no tables");
    return tableNames.stream().sorted().toList();
  }

  public void truncateAllTables(String... tablesToExclude) throws SQLException {
    try (Connection connection = dataSource.getConnection()) {
      List<String> tableNames = getAllTableNames(connection, tablesToExclude);
      truncateTablesCascade(connection, tableNames);
    }
  }

  public void resetAllSequences() throws SQLException {
    List<String> sequenceNamesToReset;
    try (Connection connection = dataSource.getConnection()) {
      sequenceNamesToReset = getSequenceNamesThatNeedToBeReset(connection);
      for (String sequenceName : sequenceNamesToReset) {
        resetSequence(sequenceName, connection);
      }
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

  private static List<String> getSequenceNamesThatNeedToBeReset(Connection connection)
      throws SQLException {
    try (Statement statement = connection.createStatement();
        ResultSet resultSet =
            statement.executeQuery(
                "select sequencename from pg_sequences where last_value is not null")) {
      List<String> sequenceNames = new ArrayList<>();

      while (resultSet.next()) {
        sequenceNames.add(resultSet.getString(1));
      }

      return sequenceNames;
    }
  }

  private static void resetSequence(String sequenceName, Connection connection)
      throws SQLException {
    try (PreparedStatement preparedStatement =
        connection.prepareStatement("alter sequence " + sequenceName + " restart with 1")) {
      preparedStatement.execute();
    }
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.liquibase;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import liquibase.change.AbstractChange;
import liquibase.change.ChangeMetaData;
import liquibase.change.DatabaseChange;
import liquibase.change.DatabaseChangeProperty;
import liquibase.database.Database;
import liquibase.database.core.PostgresDatabase;
import liquibase.database.jvm.JdbcConnection;
import liquibase.exception.DatabaseException;
import liquibase.exception.ValidationErrors;
import liquibase.statement.SqlStatement;
import liquibase.statement.core.RawSqlStatement;
import org.springframework.util.Assert;

@DatabaseChange(
    name = "migrateAutoIncrementToSequence",
    description = "Migrates a table with an auto-increment primary key to a sequence",
    priority = ChangeMetaData.PRIORITY_DEFAULT)
public class EshgMigrateAutoIncrementToSequenceChange extends AbstractChange {

  // language=PostgreSQL
  private static final String CREATE_SEQUENCE_SQL =
      """
    create sequence %s
        start with 1
        increment by %d
        no minvalue
        no maxvalue
        cache 1""";

  // language=PostgreSQL
  private static final String SELECT_SEQUENCE_VALUE_SQL =
      """
    select last_value + (case when is_called then %d else 0 end)
    from %s""";

  private static final int ALLOCATION_SIZE = 50;

  private String tableName;

  @Override
  public boolean supports(Database database) {
    return database instanceof PostgresDatabase && super.supports(database);
  }

  @DatabaseChangeProperty(description = "The name of table", exampleValue = "person")
  public String getTableName() {
    return tableName;
  }

  public void setTableName(String tableName) {
    this.tableName = tableName;
  }

  @Override
  public ValidationErrors validate(Database database) {
    ValidationErrors validationErrors = super.validate(database);
    validationErrors.checkRequiredField("tableName", tableName);
    return validationErrors;
  }

  @Override
  public String getConfirmationMessage() {
    return "Migrated auto-increment ID of %s to a sequence".formatted(getTableName());
  }

  @Override
  public boolean generateStatementsVolatile(Database database) {
    // The generated statements depend on the current sequence state
    return true;
  }

  @Override
  public SqlStatement[] generateStatements(Database database) {
    JdbcConnection jdbcConnection = (JdbcConnection) database.getConnection();
    try {
      String oldSequenceName = getTableName() + "_id_seq";
      String newSequenceName = getTableName() + "_seq";

      long nextValue = selectNextValue(jdbcConnection, oldSequenceName);

      List<SqlStatement> sqlStatements = new ArrayList<>();

      sqlStatements.add(
          new RawSqlStatement(CREATE_SEQUENCE_SQL.formatted(newSequenceName, ALLOCATION_SIZE)));

      if (nextValue > 1) {
        sqlStatements.add(
            new RawSqlStatement(
                "alter sequence %s restart with %d".formatted(newSequenceName, nextValue)));
      }

      sqlStatements.add(
          new RawSqlStatement(
              "alter table %s alter column id drop identity".formatted(getTableName())));

      return sqlStatements.toArray(SqlStatement[]::new);
    } catch (DatabaseException | SQLException e) {
      throw new RuntimeException(e);
    }
  }

  private static long selectNextValue(JdbcConnection jdbcConnection, String oldSequenceName)
      throws SQLException, DatabaseException {
    try (Statement statement = jdbcConnection.createStatement();
        ResultSet resultSet =
            statement.executeQuery(
                SELECT_SEQUENCE_VALUE_SQL.formatted(ALLOCATION_SIZE, oldSequenceName))) {
      Assert.isTrue(
          resultSet.next(),
          () ->
              "Got no result when selecting the state of sequence '%s'".formatted(oldSequenceName));
      return resultSet.getLong(1);
    }
  }
}

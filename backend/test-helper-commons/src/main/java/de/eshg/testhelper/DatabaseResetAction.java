/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

import java.sql.SQLException;
import org.apache.commons.lang3.exception.UncheckedException;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@ConditionalOnBean(DatabaseResetHelper.class)
@ConditionalOnTestHelperEnabled
@ConditionalOnMissingBean(DatabaseResetAction.class)
@Component
@Order(10)
public class DatabaseResetAction implements TestHelperServiceResetAction {

  private final DatabaseResetHelper databaseResetHelper;

  public DatabaseResetAction(DatabaseResetHelper databaseResetHelper) {
    this.databaseResetHelper = databaseResetHelper;
  }

  @Override
  public void reset() {
    try {
      databaseResetHelper.truncateAllTables(getTablesToExclude());
    } catch (SQLException e) {
      throw new UncheckedException(e);
    }
    databaseResetHelper.resetAllSequences();
  }

  protected String[] getTablesToExclude() {
    return new String[] {};
  }
}

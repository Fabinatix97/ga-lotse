/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.testhelper;

import de.eshg.base.icd10.persistence.entity.Icd10Code;
import de.eshg.base.icd10.persistence.entity.Icd10Group;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.DatabaseResetAction;
import de.eshg.testhelper.DatabaseResetHelper;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@ConditionalOnTestHelperEnabled
@Component
@Order(10)
public class BaseDatabaseResetAction extends DatabaseResetAction {

  public BaseDatabaseResetAction(DatabaseResetHelper databaseResetHelper) {
    super(databaseResetHelper);
  }

  @Override
  protected String[] getTablesToExclude() {
    return new String[] {Icd10Code.TABLE_NAME, Icd10Group.TABLE_NAME};
  }
}

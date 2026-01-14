/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

import de.eshg.testhelper.api.TestHelperDatabaseConnectionDetailsResponse;

public interface TestHelperWithDatabaseService extends TestHelperService {

  TestHelperDatabaseConnectionDetailsResponse getDatabaseConnectionDetails();

  void restoreDatabaseSnapshot(String sql) throws Exception;
}

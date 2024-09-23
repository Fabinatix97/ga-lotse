/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

import de.eshg.testhelper.api.DefaultPopulationResponse;
import de.eshg.testhelper.interception.InterceptionType;
import de.eshg.testhelper.interception.TestHelperInterceptionRequestFilter;
import java.sql.SQLException;
import java.time.Duration;
import java.time.Instant;
import java.time.Period;

public interface TestHelperService {

  Instant reset() throws SQLException;

  void interceptNextRequest(InterceptionType type, TestHelperInterceptionRequestFilter filter);

  long addBarrier(TestHelperInterceptionRequestFilter filter);

  void resetInterceptions();

  void awaitAndRemoveBarrier(long barrierId, Long timeoutInMillis);

  void waitUntilSomeoneIsAwaitingTheCyclicBarrier(long barrierId);

  Instant windClockForward(Period period, Duration duration);

  void setClock(Instant newInstant);

  DefaultPopulationResponse populateDefaults();
}

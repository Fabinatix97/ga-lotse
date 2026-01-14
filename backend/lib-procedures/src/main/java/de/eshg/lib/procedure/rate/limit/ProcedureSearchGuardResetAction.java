/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.rate.limit;

import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperServiceResetAction;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnTestHelperEnabled
@Order(70)
public class ProcedureSearchGuardResetAction implements TestHelperServiceResetAction {

  private final ProcedureSearchGuard procedureSearchGuard;

  public ProcedureSearchGuardResetAction(ProcedureSearchGuard procedureSearchGuard) {
    this.procedureSearchGuard = procedureSearchGuard;
  }

  @Override
  public void reset() {
    procedureSearchGuard.resetRateLimit();
  }
}

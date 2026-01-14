/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.rate.limit;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public abstract class AbstractProcedureSearchGuardInterceptor
    implements ModuleProcedureSearchGuardInterceptor {

  private final ProcedureSearchGuard procedureSearchGuard;

  protected AbstractProcedureSearchGuardInterceptor(ProcedureSearchGuard procedureSearchGuard) {
    this.procedureSearchGuard = procedureSearchGuard;
  }

  @Override
  public boolean preHandle(
      HttpServletRequest request, HttpServletResponse response, Object handler) {
    if (getMethod().equals(request.getMethod())) {
      procedureSearchGuard.guard();
    }
    return true;
  }
}

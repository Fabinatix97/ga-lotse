/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.rate.limit;

import de.eshg.dental.ChildController;
import de.eshg.lib.procedure.rate.limit.AbstractProcedureSearchGuardInterceptor;
import de.eshg.lib.procedure.rate.limit.ProcedureSearchGuard;
import de.eshg.testhelper.interception.HttpMethod;
import org.springframework.stereotype.Component;

@Component
public class DentalProcedureSearchGuardInterceptor extends AbstractProcedureSearchGuardInterceptor {

  public DentalProcedureSearchGuardInterceptor(ProcedureSearchGuard procedureSearchGuard) {
    super(procedureSearchGuard);
  }

  @Override
  public String getApiPath() {
    return ChildController.BASE_URL;
  }

  @Override
  public String getMethod() {
    return HttpMethod.GET.name();
  }
}

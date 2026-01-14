/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.rate.limit;

import de.eshg.lib.procedure.rate.limit.AbstractProcedureSearchGuardInterceptor;
import de.eshg.lib.procedure.rate.limit.ProcedureSearchGuard;
import de.eshg.officialmedicalservice.procedure.EmployeeOmsProcedureController;
import de.eshg.testhelper.interception.HttpMethod;
import org.springframework.stereotype.Component;

@Component
public class OmsProcedureSearchGuardInterceptor extends AbstractProcedureSearchGuardInterceptor {

  public OmsProcedureSearchGuardInterceptor(ProcedureSearchGuard procedureSearchGuard) {
    super(procedureSearchGuard);
  }

  @Override
  public String getApiPath() {
    return EmployeeOmsProcedureController.BASE_URL + EmployeeOmsProcedureController.PROCEDURES_URL;
  }

  @Override
  public String getMethod() {
    return HttpMethod.GET.name();
  }
}

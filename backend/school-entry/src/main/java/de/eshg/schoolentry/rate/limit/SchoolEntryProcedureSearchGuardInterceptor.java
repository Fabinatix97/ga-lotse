/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.rate.limit;

import de.eshg.lib.procedure.rate.limit.AbstractProcedureSearchGuardInterceptor;
import de.eshg.lib.procedure.rate.limit.ProcedureSearchGuard;
import de.eshg.schoolentry.SchoolEntryController;
import de.eshg.testhelper.interception.HttpMethod;
import org.springframework.stereotype.Component;

@Component
public class SchoolEntryProcedureSearchGuardInterceptor
    extends AbstractProcedureSearchGuardInterceptor {

  public SchoolEntryProcedureSearchGuardInterceptor(ProcedureSearchGuard procedureSearchGuard) {
    super(procedureSearchGuard);
  }

  @Override
  public String getApiPath() {
    return SchoolEntryController.BASE_URL;
  }

  @Override
  public String getMethod() {
    return HttpMethod.GET.name();
  }
}

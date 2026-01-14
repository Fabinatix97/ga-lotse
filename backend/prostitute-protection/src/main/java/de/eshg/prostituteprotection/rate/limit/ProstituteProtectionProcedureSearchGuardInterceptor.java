/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.rate.limit;

import de.eshg.lib.procedure.rate.limit.AbstractProcedureSearchGuardInterceptor;
import de.eshg.lib.procedure.rate.limit.ProcedureSearchGuard;
import de.eshg.prostituteprotection.ProstituteProtectionController;
import de.eshg.testhelper.interception.HttpMethod;
import org.springframework.stereotype.Component;

@Component
public class ProstituteProtectionProcedureSearchGuardInterceptor
    extends AbstractProcedureSearchGuardInterceptor {

  public ProstituteProtectionProcedureSearchGuardInterceptor(
      ProcedureSearchGuard procedureSearchGuard) {
    super(procedureSearchGuard);
  }

  @Override
  public String getApiPath() {
    return ProstituteProtectionController.BASE_URL + ProstituteProtectionController.PERSON_SEARCH;
  }

  @Override
  public String getMethod() {
    return HttpMethod.POST.name();
  }
}

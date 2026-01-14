/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.rate.limit;

import de.eshg.lib.procedure.rate.limit.AbstractProcedureSearchGuardInterceptor;
import de.eshg.lib.procedure.rate.limit.ProcedureSearchGuard;
import de.eshg.testhelper.interception.HttpMethod;
import de.eshg.travelmedicine.vaccinationconsultation.VaccinationConsultationController;
import org.springframework.stereotype.Component;

@Component
public class TravelMedicineProcedureSearchGuardInterceptor
    extends AbstractProcedureSearchGuardInterceptor {

  public TravelMedicineProcedureSearchGuardInterceptor(ProcedureSearchGuard procedureSearchGuard) {
    super(procedureSearchGuard);
  }

  @Override
  public String getApiPath() {
    return VaccinationConsultationController.BASE_URL;
  }

  @Override
  public String getMethod() {
    return HttpMethod.GET.name();
  }
}

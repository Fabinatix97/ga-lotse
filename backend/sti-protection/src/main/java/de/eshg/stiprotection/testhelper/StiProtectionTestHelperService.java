/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.testhelper;

import de.eshg.stiprotection.StiProtectionProcedureFinder;
import de.eshg.testhelper.*;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.interception.TestRequestInterceptor;
import de.eshg.testhelper.population.BasePopulator;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@ConditionalOnTestHelperEnabled
@Service
public class StiProtectionTestHelperService extends DefaultTestHelperService {

  private final StiProtectionProcedureFinder procedureFinder;

  public StiProtectionTestHelperService(
      DatabaseResetHelper databaseResetHelper,
      TestRequestInterceptor testRequestInterceptor,
      Clock clock,
      List<BasePopulator<?>> populators,
      List<ResettableProperties> resettableProperties,
      List<TestHelperServiceResetAction> resetActions,
      EnvironmentConfig environmentConfig,
      StiProtectionProcedureFinder procedureFinder) {
    super(
        databaseResetHelper,
        testRequestInterceptor,
        clock,
        populators,
        resettableProperties,
        resetActions,
        environmentConfig);
    this.procedureFinder = procedureFinder;
  }

  public UUID getCitizenUserId(UUID procedureId) {
    return procedureFinder.findByExternalId(procedureId).getAnonymousUserId();
  }
}

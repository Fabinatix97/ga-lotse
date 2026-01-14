/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.testhelper;

import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureResponse;
import de.eshg.prostituteprotection.api.PopulationResult;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.TestHelperWithDatabaseService;
import de.eshg.testhelper.api.PopulationRequest;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.ListWithTotalNumber;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@ConditionalOnTestHelperEnabled
public class ProstituteProtectionTestHelperController extends TestHelperController {

  private final ProstituteProtectionPopulator populator;

  public ProstituteProtectionTestHelperController(
      TestHelperWithDatabaseService testHelperService,
      EnvironmentConfig environmentConfig,
      ProstituteProtectionPopulator populator) {
    super(testHelperService, environmentConfig);
    this.populator = populator;
  }

  @PostExchange("/population/procedures")
  public PopulationResult populateProcedures(@Valid @RequestBody PopulationRequest request) {
    ListWithTotalNumber<CreateProstituteProtectionProcedureResponse> result =
        populator.populate(request.numberOfEntitiesToPopulate());
    return new PopulationResult(result.entities(), result.totalNumberOfElements());
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.testhelper;

import de.eshg.medsabroad.api.CreateMedsAbroadProcedureResponse;
import de.eshg.medsabroad.api.MedsAbroadProcedurePopulationRequest;
import de.eshg.medsabroad.api.MedsAbroadProcedurePopulationResponse;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.DefaultTestHelperService;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.ListWithTotalNumber;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@ConditionalOnTestHelperEnabled
public class MedsAbroadTestHelperController extends TestHelperController {

  private final MedsAbroadProcedurePopulator populator;

  public MedsAbroadTestHelperController(
      DefaultTestHelperService testHelperService,
      MedsAbroadProcedurePopulator populator,
      EnvironmentConfig environmentConfig) {
    super(testHelperService, environmentConfig);
    this.populator = populator;
  }

  @PostExchange("/population/procedures")
  public MedsAbroadProcedurePopulationResponse populateMedsAbroadProcedures(
      @Valid @RequestBody MedsAbroadProcedurePopulationRequest request) {
    ListWithTotalNumber<CreateMedsAbroadProcedureResponse> result =
        populator.populate(request.numberOfEntitiesToPopulate());
    return new MedsAbroadProcedurePopulationResponse(
        result.entities(), result.totalNumberOfElements());
  }
}

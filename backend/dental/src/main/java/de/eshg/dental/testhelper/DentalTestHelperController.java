/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.testhelper;

import de.eshg.dental.api.ChildrenPopulationResult;
import de.eshg.dental.api.CreateChildResponse;
import de.eshg.dental.api.CreateProphylaxisSessionResponse;
import de.eshg.dental.api.ProphylaxisSessionPopulationResult;
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
public class DentalTestHelperController extends TestHelperController {

  private final ChildrenPopulator childrenPopulator;
  private final ProphylaxisSessionsPopulator prophylaxisSessionsPopulator;

  public DentalTestHelperController(
      TestHelperWithDatabaseService testHelperService,
      ChildrenPopulator childrenPopulator,
      EnvironmentConfig environmentConfig,
      ProphylaxisSessionsPopulator prophylaxisSessionsPopulator) {
    super(testHelperService, environmentConfig);
    this.childrenPopulator = childrenPopulator;
    this.prophylaxisSessionsPopulator = prophylaxisSessionsPopulator;
  }

  @PostExchange("/population/children")
  public ChildrenPopulationResult populateChildren(@Valid @RequestBody PopulationRequest request) {
    ListWithTotalNumber<CreateChildResponse> result =
        childrenPopulator.populate(request.numberOfEntitiesToPopulate());
    return new ChildrenPopulationResult(result.entities(), result.totalNumberOfElements());
  }

  @PostExchange("/population/prophylaxis-sessions")
  public ProphylaxisSessionPopulationResult populateProphylaxisSessions(
      @Valid @RequestBody PopulationRequest request) {
    ListWithTotalNumber<CreateProphylaxisSessionResponse> result =
        prophylaxisSessionsPopulator.populate(request.numberOfEntitiesToPopulate());
    return new ProphylaxisSessionPopulationResult(
        result.entities(), result.totalNumberOfElements());
  }
}

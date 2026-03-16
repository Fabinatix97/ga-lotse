/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.testhelper;

import de.eshg.infectionbriefing.api.CreateInfectionBriefingProcedureRequest;
import de.eshg.infectionbriefing.api.CreateInfectionBriefingProcedureResponse;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.DefaultTestHelperService;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.environment.EnvironmentConfig;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@ConditionalOnTestHelperEnabled
public class InfectionBriefingTestHelperController extends TestHelperController {

  private final InfectionBriefingTestHelperService helperService;

  public InfectionBriefingTestHelperController(
      DefaultTestHelperService testHelperService,
      EnvironmentConfig environmentConfig,
      InfectionBriefingTestHelperService helperService) {
    super(testHelperService, environmentConfig);
    this.helperService = helperService;
  }

  @Transactional
  @PostExchange("/create/procedure")
  public CreateInfectionBriefingProcedureResponse createInfectionBriefingProcedure(
      @Valid @RequestBody CreateInfectionBriefingProcedureRequest request) {
    return helperService.createProcedure(request);
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.infectionbriefing.InfectionBriefingProcedureController.BASE_URL;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.infectionbriefing.api.GetProceduresResponse;
import de.eshg.infectionbriefing.api.ProcedureFilterParameters;
import de.eshg.infectionbriefing.api.ProcedurePaginationParameters;
import de.eshg.rest.service.security.config.BaseUrls.InfectionBriefing;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(BASE_URL)
@Tag(name = "InfectionBriefingProcedure")
public class InfectionBriefingProcedureController {

  public static final String BASE_URL = InfectionBriefing.PROCEDURE_CONTROLLER;

  private final InfectionBriefingProcedureService procedureService;

  public InfectionBriefingProcedureController(InfectionBriefingProcedureService procedureService) {
    this.procedureService = procedureService;
  }

  @GetMapping
  @Transactional(readOnly = true)
  public GetProceduresResponse getInfectionBriefingProcedures(
      @InlineParameterObject @ParameterObject @Valid ProcedureFilterParameters filterParameters,
      @InlineParameterObject @ParameterObject @Valid
          ProcedurePaginationParameters paginationParameters) {
    return procedureService.getProcedures(filterParameters, paginationParameters);
  }
}

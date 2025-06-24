/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.schoolentry.api.PercentilesDto;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.percentiles.PercentileCalculationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ValueEvaluatorController.BASE_URL)
@Tag(name = "ValueEvaluator")
public class ValueEvaluatorController {

  public static final String BASE_URL = BaseUrls.SchoolEntry.VALUE_EVALUATOR_CONTROLLER;

  private final SchoolEntryService schoolEntryService;

  private final PercentileCalculationService percentileCalculationService;

  public ValueEvaluatorController(
      SchoolEntryService schoolEntryService,
      PercentileCalculationService percentileCalculationService) {
    this.schoolEntryService = schoolEntryService;
    this.percentileCalculationService = percentileCalculationService;
  }

  @GetMapping("/{procedureId}/percentiles")
  @Transactional(readOnly = true)
  @Operation(
      summary = "Get calculated percentile values",
      description =
          "To calculate the percentiles, in addition to the data provided, the child's age and gender are also required.")
  public PercentilesDto getPercentiles(
      @PathVariable("procedureId") UUID procedureId,
      @RequestParam(name = "height", required = false)
          @Schema(description = "Measured height in cm.", type = "number", format = "integer")
          Integer height,
      @RequestParam(name = "weight", required = false)
          @Schema(description = "Measured weight in kg.", type = "number", format = "double")
          Double weight) {
    Validator.validateWeight(weight);
    Validator.validateHeight(height);
    SchoolEntryProcedure procedure = schoolEntryService.findProcedureByExternalId(procedureId);
    return percentileCalculationService.getPercentiles(procedure, height, weight);
  }
}

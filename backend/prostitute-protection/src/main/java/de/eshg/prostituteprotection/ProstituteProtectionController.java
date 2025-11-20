/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureRequest;
import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureResponse;
import de.eshg.prostituteprotection.api.GetProstituteProtectionProceduresResponse;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedurePaginationAndSortParameters;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.mapper.ProstituteProtectionMapper;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = ProstituteProtectionController.BASE_URL)
@Tag(name = "ProstituteProtection")
public class ProstituteProtectionController {
  public static final String BASE_URL = BaseUrls.ProstituteProtection.PROCEDURE_CONTROLLER;

  private final ProstituteProtectionService prostituteProtectionService;

  public ProstituteProtectionController(ProstituteProtectionService prostituteProtectionService) {
    this.prostituteProtectionService = prostituteProtectionService;
  }

  @PostMapping
  @Operation(summary = "Create a new prostitute-protection procedure.")
  @Transactional
  public CreateProstituteProtectionProcedureResponse createProstituteProtectionProcedure(
      @Valid @RequestBody CreateProstituteProtectionProcedureRequest request) {
    return prostituteProtectionService.createProstituteProtectionProcedure(request);
  }

  @GetMapping
  @Transactional(readOnly = true)
  @Operation(summary = "Get prostitute protection procedures. Sort and page the results.")
  public GetProstituteProtectionProceduresResponse getProstituteProtectionProcedures(
      @InlineParameterObject @ParameterObject @Valid
          ProstituteProtectionProcedurePaginationAndSortParameters paginationAndSortParameters) {
    Page<ProstituteProtectionProcedure> pagedProcedures =
        prostituteProtectionService.getProcedures(paginationAndSortParameters);
    return new GetProstituteProtectionProceduresResponse(
        pagedProcedures.stream()
            .map(ProstituteProtectionMapper::mapProcedureToOverviewDto)
            .toList(),
        pagedProcedures.getTotalElements());
  }
}

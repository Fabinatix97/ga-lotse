/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.medsabroad.api.CreateMedsAbroadProcedureRequest;
import de.eshg.medsabroad.api.CreateMedsAbroadProcedureResponse;
import de.eshg.medsabroad.api.GetMedsAbroadProcedureResponse;
import de.eshg.medsabroad.api.GetMedsAbroadProceduresFilterOptions;
import de.eshg.medsabroad.api.GetMedsAbroadProceduresPaginationOptions;
import de.eshg.medsabroad.api.GetMedsAbroadProceduresResponse;
import de.eshg.medsabroad.api.GetMedsAbroadProceduresSortOptions;
import de.eshg.medsabroad.api.MedsAbroadProcedureDto;
import de.eshg.medsabroad.mapper.MedsAbroadProcedureMapper;
import de.eshg.medsabroad.mapper.MedsAbroadProcedureSpecificationMapper;
import de.eshg.medsabroad.persistence.centralfile.MedsAbroadProcedureDetails;
import de.eshg.medsabroad.persistence.centralfile.PersonClient;
import de.eshg.medsabroad.persistence.database.MedsAbroadProcedure;
import de.eshg.medsabroad.persistence.support.MedsAbroadProcedureSpecification;
import de.eshg.rest.service.security.config.BaseUrls.MedsAbroad;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(MedsAbroadController.BASE_URL)
@Tag(name = "MedsAbroad")
public class MedsAbroadController {
  public static final String BASE_URL = MedsAbroad.PROCEDURE_CONTROLLER;

  public final MedsAbroadService medsAbroadService;
  private final PersonClient personClient;

  public MedsAbroadController(MedsAbroadService medsAbroadService, PersonClient personClient) {
    this.medsAbroadService = medsAbroadService;
    this.personClient = personClient;
  }

  @PostMapping
  @Operation(summary = "Create a new meds abroad procedure.")
  @Transactional
  public CreateMedsAbroadProcedureResponse createMedsAbroadProcedure(
      @Valid @RequestBody CreateMedsAbroadProcedureRequest request) {
    MedsAbroadProcedure procedure = medsAbroadService.createProcedure();
    UUID centralFilePersonId = personClient.createPersonInCentralFile(request.person());
    medsAbroadService.addPerson(procedure, centralFilePersonId);
    return new CreateMedsAbroadProcedureResponse(procedure.getExternalId());
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get meds abroad procedure by id.")
  @Transactional(readOnly = true)
  public GetMedsAbroadProcedureResponse getMedsAbroadProcedure(
      @PathVariable("id") UUID procedureId) {
    MedsAbroadProcedure procedure = medsAbroadService.findProcedureByExternalId(procedureId);
    MedsAbroadProcedureDetails procedureDetails =
        personClient.augmentProcedureWithPersonDetails(procedure);
    return MedsAbroadProcedureMapper.toInterfaceType(procedureDetails);
  }

  @GetMapping
  @Operation(summary = "Get filtered and sorted meds abroad procedures.")
  @Transactional(readOnly = true)
  public GetMedsAbroadProceduresResponse getMedsAbroadProcedures(
      @Valid @ParameterObject @InlineParameterObject
          GetMedsAbroadProceduresPaginationOptions paginationOptions,
      @Valid @ParameterObject @InlineParameterObject GetMedsAbroadProceduresSortOptions sortOptions,
      @Valid @ParameterObject @InlineParameterObject
          GetMedsAbroadProceduresFilterOptions filterOptions) {
    MedsAbroadProcedureSpecification specification =
        MedsAbroadProcedureSpecificationMapper.toSpecification(filterOptions);
    PageRequest pageRequest =
        PageRequest.of(
            paginationOptions.pageNumber(),
            paginationOptions.pageSize(),
            MedsAbroadProcedureSpecificationMapper.toSortDirection(sortOptions),
            MedsAbroadProcedureSpecificationMapper.toSortProperty(sortOptions));

    Page<MedsAbroadProcedure> pageResult =
        medsAbroadService.findProcedures(specification, pageRequest);
    List<MedsAbroadProcedureDto> medsAbroadProcedureDetails =
        personClient
            .augmentProceduresWithPersonDetails(pageResult.getContent(), sortOptions)
            .map(MedsAbroadProcedureMapper::toOverviewType)
            .toList();

    return new GetMedsAbroadProceduresResponse(
        pageResult.getTotalPages(), pageResult.getTotalElements(), medsAbroadProcedureDetails);
  }
}

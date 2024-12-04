/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.dental.api.CreateProphylaxisSessionRequest;
import de.eshg.dental.api.CreateProphylaxisSessionResponse;
import de.eshg.dental.api.GetProphylaxisSessionResponse;
import de.eshg.dental.api.ProphylaxisSessionDetailsDto;
import de.eshg.dental.api.ProphylaxisSessionPaginationAndSortParameters;
import de.eshg.dental.business.model.ProphylaxisSessionWithAugmentedData;
import de.eshg.dental.domain.model.ProphylaxisSession;
import de.eshg.dental.mapper.ProphylaxisSessionMapper;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ProphylaxisSessionController.BASE_URL)
@Tag(name = "ProphylaxisSession")
public class ProphylaxisSessionController {

  public static final String BASE_URL = BaseUrls.Dental.PROPHYLAXIS_SESSION_CONTROLLER;

  private final ProphylaxisSessionService prophylaxisSessionService;
  private final Validator validator;

  public ProphylaxisSessionController(
      ProphylaxisSessionService prophylaxisSessionService, Validator validator) {
    this.prophylaxisSessionService = prophylaxisSessionService;
    this.validator = validator;
  }

  @PostMapping
  @Transactional
  public CreateProphylaxisSessionResponse createProphylaxisSession(
      @Valid @RequestBody CreateProphylaxisSessionRequest request) {
    validator.validateInstitution(request.institutionId());
    ProphylaxisSession prophylaxisSession =
        prophylaxisSessionService.createProphylaxisSession(request);
    return new CreateProphylaxisSessionResponse(prophylaxisSession.getExternalId());
  }

  @GetMapping
  @Transactional(readOnly = true)
  public GetProphylaxisSessionResponse getProphylaxisSessions(
      @InlineParameterObject @ParameterObject @Valid
          ProphylaxisSessionPaginationAndSortParameters paginationAndSortParameters,
      @InlineParameterObject @ParameterObject @Valid
          ProphylaxisSessionFilterParameters filterParameters) {
    Page<ProphylaxisSessionWithAugmentedData> prophylaxisSessions =
        prophylaxisSessionService.getProphylaxisSessions(
            paginationAndSortParameters, filterParameters);
    return new GetProphylaxisSessionResponse(
        prophylaxisSessions.stream()
            .map(ProphylaxisSessionMapper::mapProphylaxisSessionToDto)
            .toList(),
        prophylaxisSessions.getTotalElements());
  }

  @GetMapping("/{prophylaxisSessionId}")
  @Transactional(readOnly = true)
  public ProphylaxisSessionDetailsDto getProphylaxisSession(
      @PathVariable("prophylaxisSessionId") UUID prophylaxisSessionId) {
    return ProphylaxisSessionMapper.mapProphylaxisSessionToDetailsDto(
        prophylaxisSessionService.getProphylaxisSession(prophylaxisSessionId));
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import static de.eshg.dental.mapper.ProphylaxisSessionMapper.mapProphylaxisSessionToDetailsDto;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.dental.api.CloseProphylaxisSessionRequest;
import de.eshg.dental.api.CreateProphylaxisSessionRequest;
import de.eshg.dental.api.CreateProphylaxisSessionResponse;
import de.eshg.dental.api.GetProphylaxisSessionResponse;
import de.eshg.dental.api.ProphylaxisSessionDetailsDto;
import de.eshg.dental.api.ProphylaxisSessionPaginationAndSortParameters;
import de.eshg.dental.api.UpdateProphylaxisSessionExaminationsRequest;
import de.eshg.dental.api.UpdateProphylaxisSessionParticipantsRequest;
import de.eshg.dental.api.UpdateProphylaxisSessionRequest;
import de.eshg.dental.business.model.ProphylaxisSessionWithAugmentedInstitution;
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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ProphylaxisSessionController.BASE_URL)
@Tag(name = "ProphylaxisSession")
public class ProphylaxisSessionController {

  public static final String BASE_URL = BaseUrls.Dental.PROPHYLAXIS_SESSION_CONTROLLER;

  private final ProphylaxisSessionService prophylaxisSessionService;

  public ProphylaxisSessionController(ProphylaxisSessionService prophylaxisSessionService) {
    this.prophylaxisSessionService = prophylaxisSessionService;
  }

  @PostMapping
  @Transactional
  public CreateProphylaxisSessionResponse createProphylaxisSession(
      @Valid @RequestBody CreateProphylaxisSessionRequest request) {
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
    Page<ProphylaxisSessionWithAugmentedInstitution> prophylaxisSessions =
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
    return mapProphylaxisSessionToDetailsDto(
        prophylaxisSessionService.getProphylaxisSessionWithDetails(prophylaxisSessionId));
  }

  @PutMapping("/{prophylaxisSessionId}")
  @Transactional
  public ProphylaxisSessionDetailsDto updateProphylaxisSession(
      @PathVariable("prophylaxisSessionId") UUID prophylaxisSessionId,
      @Valid @RequestBody UpdateProphylaxisSessionRequest request) {
    return mapProphylaxisSessionToDetailsDto(
        prophylaxisSessionService.updateProphylaxisSession(prophylaxisSessionId, request));
  }

  @PutMapping("/{prophylaxisSessionId}/participants")
  @Transactional
  public ProphylaxisSessionDetailsDto updateProphylaxisSessionParticipants(
      @PathVariable("prophylaxisSessionId") UUID prophylaxisSessionId,
      @Valid @RequestBody UpdateProphylaxisSessionParticipantsRequest request) {
    return mapProphylaxisSessionToDetailsDto(
        prophylaxisSessionService.updateProphylaxisSessionParticipants(
            prophylaxisSessionId, request));
  }

  @PatchMapping("/{prophylaxisSessionId}/examinations")
  @Transactional
  public ProphylaxisSessionDetailsDto updateProphylaxisSessionExaminations(
      @PathVariable("prophylaxisSessionId") UUID prophylaxisSessionId,
      @Valid @RequestBody UpdateProphylaxisSessionExaminationsRequest request) {
    return mapProphylaxisSessionToDetailsDto(
        prophylaxisSessionService.updateProphylaxisSessionExaminations(
            prophylaxisSessionId, request));
  }

  @PostMapping("/{prophylaxisSessionId}/close-prophylaxis-session")
  @Transactional
  public ProphylaxisSessionDetailsDto closeProphylaxisSession(
      @PathVariable("prophylaxisSessionId") UUID prophylaxisSessionId,
      @Valid @RequestBody CloseProphylaxisSessionRequest request) {
    prophylaxisSessionService.closeProphylaxisSession(prophylaxisSessionId, request.version());
    return mapProphylaxisSessionToDetailsDto(
        prophylaxisSessionService.getProphylaxisSessionWithDetails(prophylaxisSessionId));
  }
}

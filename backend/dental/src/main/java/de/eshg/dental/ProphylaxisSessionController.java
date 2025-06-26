/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import static de.eshg.dental.mapper.ProphylaxisSessionMapper.mapProphylaxisSessionToDetailsDto;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.dental.api.*;
import de.eshg.dental.business.model.ProphylaxisSessionWithAugmentedInstitution;
import de.eshg.dental.domain.model.ProphylaxisSession;
import de.eshg.dental.mapper.ProphylaxisSessionMapper;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

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
  @Operation(summary = "Creates a new prophylaxis")
  public CreateProphylaxisSessionResponse createProphylaxisSession(
      @Valid @RequestBody CreateProphylaxisSessionRequest request) {
    ProphylaxisSession prophylaxisSession =
        prophylaxisSessionService.createProphylaxisSession(request);
    return new CreateProphylaxisSessionResponse(prophylaxisSession.getExternalId());
  }

  @GetMapping
  @Transactional(readOnly = true)
  @Operation(summary = "Returns a filtered and paginated list of prophylaxis sessions")
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
  @Operation(summary = "Retrieves a specific prophylaxis session by ID")
  public ProphylaxisSessionDetailsDto getProphylaxisSession(
      @PathVariable("prophylaxisSessionId") UUID prophylaxisSessionId) {
    return mapProphylaxisSessionToDetailsDto(
        prophylaxisSessionService.getProphylaxisSessionWithDetails(prophylaxisSessionId));
  }

  @PutMapping("/{prophylaxisSessionId}")
  @Transactional
  @Operation(summary = "Updates a prophylaxis session")
  public ProphylaxisSessionDetailsDto updateProphylaxisSession(
      @PathVariable("prophylaxisSessionId") UUID prophylaxisSessionId,
      @Valid @RequestBody UpdateProphylaxisSessionRequest request) {
    return mapProphylaxisSessionToDetailsDto(
        prophylaxisSessionService.updateProphylaxisSession(prophylaxisSessionId, request));
  }

  @PutMapping("/{prophylaxisSessionId}/participants")
  @Transactional
  @Operation(summary = "Updates the participants of a given prophylaxis session")
  public ProphylaxisSessionDetailsDto updateProphylaxisSessionParticipants(
      @PathVariable("prophylaxisSessionId") UUID prophylaxisSessionId,
      @Valid @RequestBody UpdateProphylaxisSessionParticipantsRequest request) {
    return mapProphylaxisSessionToDetailsDto(
        prophylaxisSessionService.updateProphylaxisSessionParticipants(
            prophylaxisSessionId, request));
  }

  @PatchMapping("/{prophylaxisSessionId}/examinations")
  @Transactional
  @Operation(summary = "Updates an examination of a given prophylaxis session")
  public ProphylaxisSessionDetailsDto updateProphylaxisSessionExaminations(
      @PathVariable("prophylaxisSessionId") UUID prophylaxisSessionId,
      @Valid @RequestBody UpdateProphylaxisSessionExaminationsRequest request) {
    return mapProphylaxisSessionToDetailsDto(
        prophylaxisSessionService.updateProphylaxisSessionExaminations(
            prophylaxisSessionId, request));
  }

  @PostMapping("/{prophylaxisSessionId}/close-prophylaxis-session")
  @Transactional
  @Operation(summary = "Changes the status of a prophylaxis session")
  public ProphylaxisSessionDetailsDto closeProphylaxisSession(
      @PathVariable("prophylaxisSessionId") UUID prophylaxisSessionId,
      @Valid @RequestBody CloseProphylaxisSessionRequest request) {
    prophylaxisSessionService.closeProphylaxisSession(prophylaxisSessionId, request.version());
    return mapProphylaxisSessionToDetailsDto(
        prophylaxisSessionService.getProphylaxisSessionWithDetails(prophylaxisSessionId));
  }

  @DeleteMapping("/{prophylaxisSessionId}")
  @Transactional
  @Operation(summary = "Removes a prophylaxis")
  public void deleteProphylaxisSession(
      @PathVariable("prophylaxisSessionId") UUID prophylaxisSessionId,
      @Valid @RequestBody DeleteProphylaxisSessionRequest request) {
    prophylaxisSessionService.deleteProphylaxisSession(prophylaxisSessionId, request.version());
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.infectionbriefing.InfectionBriefingProcedureController.BASE_URL;
import static de.eshg.lib.procedure.util.ProcedureValidator.hasNonNullValue;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.infectionbriefing.api.AcceptDraftRequest;
import de.eshg.infectionbriefing.api.ConfirmPaymentRequest;
import de.eshg.infectionbriefing.api.CreateNewCertificateProcedureRequest;
import de.eshg.infectionbriefing.api.CreateNewCertificateProcedureResponse;
import de.eshg.infectionbriefing.api.GetProceduresResponse;
import de.eshg.infectionbriefing.api.IssueCertificateResponse;
import de.eshg.infectionbriefing.api.ProcedureDetailsDto;
import de.eshg.infectionbriefing.api.ProcedureFilterParameters;
import de.eshg.infectionbriefing.api.ProcedurePaginationParameters;
import de.eshg.infectionbriefing.api.ProcedureSearchParameters;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls.InfectionBriefing;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Optional;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(BASE_URL)
@Tag(name = "InfectionBriefingProcedure")
public class InfectionBriefingProcedureController {

  public static final String BASE_URL = InfectionBriefing.PROCEDURE_CONTROLLER;

  private final InfectionBriefingProcedureService infectionBriefingProcedureService;
  private final NewCertificateProcedureService newCertificateProcedureService;
  private final CreateInfectionBriefingProcedureService createInfectionBriefingProcedureService;

  public InfectionBriefingProcedureController(
      InfectionBriefingProcedureService infectionBriefingProcedureService,
      NewCertificateProcedureService newCertificateProcedureService,
      CreateInfectionBriefingProcedureService createInfectionBriefingProcedureService) {
    this.infectionBriefingProcedureService = infectionBriefingProcedureService;
    this.newCertificateProcedureService = newCertificateProcedureService;
    this.createInfectionBriefingProcedureService = createInfectionBriefingProcedureService;
  }

  @GetMapping
  @Transactional(readOnly = true)
  public GetProceduresResponse getInfectionBriefingProcedures(
      @InlineParameterObject @ParameterObject @Valid ProcedureFilterParameters filterParameters,
      @InlineParameterObject @ParameterObject @Valid
          ProcedurePaginationParameters paginationParameters,
      @InlineParameterObject @ParameterObject @Valid ProcedureSearchParameters searchParameters) {
    if (hasNonNullValue(searchParameters)) {
      if (hasNonNullValue(filterParameters)) {
        throw new BadRequestException(
            "Filter parameters and search parameters can not be used in the same request.");
      } else {
        return infectionBriefingProcedureService.searchProcedures(
            searchParameters, paginationParameters);
      }
    }
    return infectionBriefingProcedureService.getProcedures(filterParameters, paginationParameters);
  }

  @GetMapping("{procedureId}")
  @Transactional(readOnly = true)
  public ProcedureDetailsDto getInfectionBriefingProcedureDetails(
      @PathVariable(name = "procedureId") UUID procedureId) {
    return infectionBriefingProcedureService.getProcedureDetails(procedureId);
  }

  @PostMapping
  @Transactional
  public CreateNewCertificateProcedureResponse createNewCertificateProcedure(
      @Valid @RequestBody CreateNewCertificateProcedureRequest request) {
    return createInfectionBriefingProcedureService.createNewCertificateProcedureByEmployee(request);
  }

  @PostMapping("{procedureId}/accept-draft")
  @Transactional
  public void acceptDraft(
      @PathVariable(name = "procedureId") UUID procedureId,
      @Valid @RequestBody(required = false) AcceptDraftRequest request) {
    newCertificateProcedureService.acceptDraft(procedureId, Optional.ofNullable(request));
  }

  @PostMapping("{procedureId}/abort-procedure")
  @Transactional
  public void abortDraft(@PathVariable(name = "procedureId") UUID procedureId) {
    infectionBriefingProcedureService.abort(procedureId);
  }

  @PostMapping("{procedureId}/briefing")
  @Transactional
  public void confirmInfectionBriefing(@PathVariable(name = "procedureId") UUID procedureId) {
    newCertificateProcedureService.confirmInfectionBriefing(procedureId);
  }

  @PostMapping("{procedureId}/payment")
  @Transactional
  public void confirmPayment(
      @PathVariable(name = "procedureId") UUID procedureId,
      @Valid @RequestBody ConfirmPaymentRequest request) {
    newCertificateProcedureService.confirmPayment(procedureId, request);
  }

  @PostMapping("{procedureId}/certificate")
  @Transactional
  public IssueCertificateResponse issueCertificate(
      @PathVariable(name = "procedureId") UUID procedureId) {
    return newCertificateProcedureService.issueCertificate(procedureId);
  }

  @PostMapping("{procedureId}/replacement-certificate")
  @Transactional
  public IssueCertificateResponse issueReplacementCertificate(
      @PathVariable(name = "procedureId") UUID procedureId) {
    return newCertificateProcedureService.issueReplacementCertificate(procedureId);
  }

  @PostMapping("{procedureId}/close-procedure")
  @Transactional
  public void closeProcedure(@PathVariable(name = "procedureId") UUID procedureId) {
    infectionBriefingProcedureService.close(procedureId);
  }

  @PostMapping("{procedureId}/reopen-procedure")
  @Transactional
  public void reopenProcedure(@PathVariable(name = "procedureId") UUID procedureId) {
    infectionBriefingProcedureService.reopen(procedureId);
  }
}

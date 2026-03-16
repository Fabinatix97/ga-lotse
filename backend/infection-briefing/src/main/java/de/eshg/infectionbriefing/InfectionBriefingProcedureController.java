/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.infectionbriefing.InfectionBriefingProcedureController.BASE_URL;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.infectionbriefing.api.AbortDraftRequest;
import de.eshg.infectionbriefing.api.AcceptDraftRequest;
import de.eshg.infectionbriefing.api.ConfirmPaymentRequest;
import de.eshg.infectionbriefing.api.CreateNewCertificateProcedureRequest;
import de.eshg.infectionbriefing.api.CreateNewCertificateProcedureResponse;
import de.eshg.infectionbriefing.api.GetInfectionBriefingProceduresResponse;
import de.eshg.infectionbriefing.api.InfectionBriefingProcedureDetailsDto;
import de.eshg.infectionbriefing.api.IssueCertificateResponse;
import de.eshg.infectionbriefing.api.ProcedureFilterParameters;
import de.eshg.infectionbriefing.api.ProcedurePaginationParameters;
import de.eshg.infectionbriefing.api.ProcedureSearchParameters;
import de.eshg.infectionbriefing.api.UpdateApplicantRequest;
import de.eshg.rest.service.security.config.BaseUrls.InfectionBriefing;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Optional;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
  private final InfectionBriefingAppointmentService infectionBriefingAppointmentService;

  public InfectionBriefingProcedureController(
      InfectionBriefingProcedureService infectionBriefingProcedureService,
      NewCertificateProcedureService newCertificateProcedureService,
      CreateInfectionBriefingProcedureService createInfectionBriefingProcedureService,
      InfectionBriefingAppointmentService infectionBriefingAppointmentService) {
    this.infectionBriefingProcedureService = infectionBriefingProcedureService;
    this.newCertificateProcedureService = newCertificateProcedureService;
    this.createInfectionBriefingProcedureService = createInfectionBriefingProcedureService;
    this.infectionBriefingAppointmentService = infectionBriefingAppointmentService;
  }

  @GetMapping
  @Transactional(readOnly = true)
  public GetInfectionBriefingProceduresResponse getInfectionBriefingProcedures(
      @InlineParameterObject @ParameterObject @Valid ProcedureFilterParameters filterParameters,
      @InlineParameterObject @ParameterObject @Valid
          ProcedurePaginationParameters paginationParameters,
      @InlineParameterObject @ParameterObject @Valid ProcedureSearchParameters searchParameters) {
    return infectionBriefingProcedureService.getProcedures(
        filterParameters, paginationParameters, searchParameters);
  }

  @GetMapping("{procedureId}")
  @Transactional(readOnly = true)
  public InfectionBriefingProcedureDetailsDto getInfectionBriefingProcedureDetails(
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

  @PostMapping("{procedureId}/abort-draft")
  @Transactional
  public void abortDraft(
      @PathVariable(name = "procedureId") UUID procedureId,
      @Valid @RequestBody AbortDraftRequest request) {
    infectionBriefingAppointmentService.cancelAppointmentAndAbortDraftByEmployee(
        procedureId, request);
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

  @PatchMapping("{procedureId}/applicant")
  @Transactional
  public void updateApplicant(
      @PathVariable(name = "procedureId") UUID procedureId,
      @Valid @RequestBody UpdateApplicantRequest applicant) {
    infectionBriefingProcedureService.updateApplicant(procedureId, applicant);
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.testhelper;

import de.eshg.auditlog.AuditLogClientTestHelperApi;
import de.eshg.lib.auditlog.AuditLogTestHelperService;
import de.eshg.stiprotection.api.CreateProcedureResponse;
import de.eshg.stiprotection.api.StiProtectionProcedurePopulationRequest;
import de.eshg.stiprotection.api.StiProtectionProcedurePopulationResponse;
import de.eshg.stiprotection.api.TextTemplatePopulationRequest;
import de.eshg.stiprotection.api.TextTemplatePopulationResponse;
import de.eshg.stiprotection.api.texttemplate.TextTemplateDto;
import de.eshg.stiprotection.scheduling.AppointmentCooldownRemover;
import de.eshg.stiprotection.scheduling.OverdueProceduresNotifier;
import de.eshg.stiprotection.scheduling.UnconfirmedAppointmentsRemover;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.DefaultTestHelperService;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.ListWithTotalNumber;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@ConditionalOnTestHelperEnabled
public class StiProtectionTestHelperController extends TestHelperController
    implements AuditLogClientTestHelperApi {

  private final AuditLogTestHelperService auditLogTestHelperService;
  private final StiProtectionPopulator populator;
  private final TextTemplatePopulator textTemplatePopulator;
  private final OverdueProceduresNotifier overdueProceduresNotifier;
  private final UnconfirmedAppointmentsRemover unconfirmedAppointmentsRemover;
  private final AppointmentCooldownRemover appointmentCooldownRemover;
  private final StiProtectionTestHelperService testHelperService;

  public StiProtectionTestHelperController(
      DefaultTestHelperService testHelperService,
      AuditLogTestHelperService auditLogTestHelperService,
      StiProtectionPopulator populator,
      TextTemplatePopulator textTemplatePopulator,
      EnvironmentConfig environmentConfig,
      OverdueProceduresNotifier overdueProceduresNotifier,
      UnconfirmedAppointmentsRemover unconfirmedAppointmentsRemover,
      AppointmentCooldownRemover appointmentCooldownRemover,
      StiProtectionTestHelperService stiProtectionTestHelperService) {
    super(testHelperService, environmentConfig);
    this.auditLogTestHelperService = auditLogTestHelperService;
    this.populator = populator;
    this.textTemplatePopulator = textTemplatePopulator;
    this.overdueProceduresNotifier = overdueProceduresNotifier;
    this.unconfirmedAppointmentsRemover = unconfirmedAppointmentsRemover;
    this.appointmentCooldownRemover = appointmentCooldownRemover;
    this.testHelperService = stiProtectionTestHelperService;
  }

  @PostExchange("/population/procedures")
  public StiProtectionProcedurePopulationResponse populateStiProtectionProcedures(
      @Valid @RequestBody StiProtectionProcedurePopulationRequest request) {
    ListWithTotalNumber<CreateProcedureResponse> result =
        populator.populate(request.numberOfEntitiesToPopulate());
    return new StiProtectionProcedurePopulationResponse(
        result.entities(), result.totalNumberOfElements());
  }

  @PostExchange("/population/text-templates")
  public TextTemplatePopulationResponse populateTextTemplates(
      @Valid @RequestBody TextTemplatePopulationRequest request) {
    ListWithTotalNumber<TextTemplateDto> result =
        this.textTemplatePopulator.populate(request.numberOfEntitiesToPopulate());
    return new TextTemplatePopulationResponse(result.entities(), result.totalNumberOfElements());
  }

  @PostExchange("/notify/overdue-procedures")
  public ResponseEntity<Void> notifyOfOverdueProcedures() {
    overdueProceduresNotifier.runNow();
    return ResponseEntity.ok().build();
  }

  @PostExchange("/notify/expired-unconfirmed-appointments")
  public ResponseEntity<Void> notifyOfExpiredUnconfirmedAppointments() {
    this.unconfirmedAppointmentsRemover.runNow();
    return ResponseEntity.ok().build();
  }

  @PostExchange("/notify/release-appointments-on-cooldown")
  public ResponseEntity<Void> removeAppointmentCooldowns() {
    this.appointmentCooldownRemover.runNow();
    return ResponseEntity.ok().build();
  }

  @GetExchange("/procedure/{procedureId}/citizen-user-id")
  @Transactional(readOnly = true)
  public UUID getCitizenUserId(@PathVariable("procedureId") UUID procedureId) {
    return testHelperService.getCitizenUserId(procedureId);
  }

  @Override
  public void runAuditLogArchivingJob() {
    auditLogTestHelperService.runAuditLogArchivingJob();
  }
}

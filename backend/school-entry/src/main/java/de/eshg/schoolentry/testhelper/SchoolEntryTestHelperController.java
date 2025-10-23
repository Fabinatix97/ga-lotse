/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.testhelper;

import de.eshg.auditlog.AuditLogClientTestHelperApi;
import de.eshg.lib.appointmentblock.api.CreateAppointmentBlockGroupResponse;
import de.eshg.lib.appointmentblock.api.LocationSelectionMode;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockConfig;
import de.eshg.lib.appointmentblock.testhelper.AppointmentBlockGroupsPopulator;
import de.eshg.lib.auditlog.AuditLogTestHelperService;
import de.eshg.schoolentry.SchoolEntryConfigService;
import de.eshg.schoolentry.api.CreateProcedureResponse;
import de.eshg.schoolentry.api.GetClosedProceduresResponse;
import de.eshg.schoolentry.api.SchoolEntryAppointmentBlockPopulationResult;
import de.eshg.schoolentry.api.SchoolEntryFeature;
import de.eshg.schoolentry.api.SchoolEntryProcedurePopulationResult;
import de.eshg.schoolentry.config.SchoolEntryFeatureToggle;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.api.PopulationRequest;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.ListWithTotalNumber;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@ConditionalOnTestHelperEnabled
public class SchoolEntryTestHelperController extends TestHelperController
    implements AuditLogClientTestHelperApi {

  private final SchoolEntryTestHelperService schoolEntryTestHelperService;
  private final SchoolEntryFeatureToggle schoolEntryFeatureToggle;
  private final SchoolEntryProceduresPopulator schoolEntryProceduresPopulator;
  private final AppointmentBlockGroupsPopulator appointmentBlockGroupsPopulator;
  private final AuditLogTestHelperService auditLogTestHelperService;
  private final SchoolEntryConfigService schoolEntryConfigService;
  private final AppointmentBlockConfig appointmentBlockConfig;

  public SchoolEntryTestHelperController(
      SchoolEntryTestHelperService schoolEntryTestHelperService,
      SchoolEntryFeatureToggle schoolEntryFeatureToggle,
      SchoolEntryProceduresPopulator schoolEntryProceduresPopulator,
      AppointmentBlockGroupsPopulator appointmentBlockGroupsPopulator,
      AuditLogTestHelperService auditLogTestHelperService,
      SchoolEntryConfigService schoolEntryConfigService,
      AppointmentBlockConfig appointmentBlockConfig,
      EnvironmentConfig environmentConfig) {
    super(schoolEntryTestHelperService, environmentConfig);
    this.schoolEntryTestHelperService = schoolEntryTestHelperService;
    this.schoolEntryFeatureToggle = schoolEntryFeatureToggle;
    this.schoolEntryProceduresPopulator = schoolEntryProceduresPopulator;
    this.appointmentBlockGroupsPopulator = appointmentBlockGroupsPopulator;
    this.auditLogTestHelperService = auditLogTestHelperService;
    this.schoolEntryConfigService = schoolEntryConfigService;
    this.appointmentBlockConfig = appointmentBlockConfig;
  }

  @GetExchange("/school-entries/{procedureId}/citizen-user-id")
  @Transactional(readOnly = true)
  public UUID getCitizenUserId(@PathVariable("procedureId") UUID procedureId) {
    return schoolEntryTestHelperService.getCitizenUserId(procedureId);
  }

  @DeleteExchange("/school-entries/{procedureId}/citizen-user-id")
  @Transactional
  public void clearCitizenUserId(@PathVariable("procedureId") UUID procedureId) {
    schoolEntryTestHelperService.clearCitizenUserId(procedureId);
  }

  @GetExchange("/school-entries/closed")
  @Transactional(readOnly = true)
  public GetClosedProceduresResponse getIdsOfClosedProcedures() {
    return new GetClosedProceduresResponse(schoolEntryTestHelperService.getIdsOfClosedProcedures());
  }

  @PostExchange("/enabled-new-features/{featureToEnable}")
  public void enableNewFeature(
      @PathVariable("featureToEnable") SchoolEntryFeature featureToEnable) {
    schoolEntryFeatureToggle.enableNewFeature(featureToEnable);
  }

  @DeleteExchange("/enabled-new-features/{featureToDisable}")
  public void disableNewFeature(
      @PathVariable("featureToDisable") SchoolEntryFeature featureToDisable) {
    schoolEntryFeatureToggle.disableNewFeature(featureToDisable);
  }

  @PostExchange("/location-selection-mode/{newLocationSelectionMode}")
  @Transactional
  public void updateLocationSelectionMode(
      @PathVariable("newLocationSelectionMode") LocationSelectionMode newLocationSelectionMode) {
    appointmentBlockConfig.setLocationSelectionMode(newLocationSelectionMode);
  }

  @PostExchange("/direct-procedure-type-assignment-on-import")
  @Transactional
  public void enableDirectProcedureTypeAssignmentOnImport() {
    schoolEntryConfigService.updateDirectProcedureTypeAssignmentOnImport(true);
  }

  @PostExchange("/population/procedures")
  public SchoolEntryProcedurePopulationResult populateProcedures(
      @Valid @RequestBody PopulationRequest request) {
    ListWithTotalNumber<CreateProcedureResponse> result =
        schoolEntryProceduresPopulator.populate(request.numberOfEntitiesToPopulate());
    return new SchoolEntryProcedurePopulationResult(
        result.entities(), result.totalNumberOfElements());
  }

  @PostExchange("/population/appointment-block-groups")
  public SchoolEntryAppointmentBlockPopulationResult populateAppointmentBlockGroups(
      @Valid @RequestBody PopulationRequest request) {
    ListWithTotalNumber<CreateAppointmentBlockGroupResponse> result =
        appointmentBlockGroupsPopulator.populate(request.numberOfEntitiesToPopulate());
    return new SchoolEntryAppointmentBlockPopulationResult(
        result.entities(), result.totalNumberOfElements());
  }

  @Override
  public void runAuditLogArchivingJob() {
    auditLogTestHelperService.runAuditLogArchivingJob();
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.schoolentry.api.vaccination.VaccinationCheckApi;
import de.eshg.schoolentry.api.vaccination.VaccinationCheckRequest;
import de.eshg.schoolentry.api.vaccination.VaccinationCheckResponse;
import de.eshg.schoolentry.config.SchoolEntryProperties;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "VaccinationCheck")
public class VaccinationCheckController implements VaccinationCheckApi {

  private final VaccinationCheckService vaccinationCheckService;
  private final SchoolEntryGuard guard;
  private final BaseFeatureTogglesApi baseFeatureTogglesApi;
  private final SchoolEntryProperties properties;

  public VaccinationCheckController(
      VaccinationCheckService vaccinationCheckService,
      SchoolEntryGuard guard,
      BaseFeatureTogglesApi baseFeatureTogglesApi,
      SchoolEntryProperties properties) {
    this.vaccinationCheckService = vaccinationCheckService;
    this.guard = guard;
    this.baseFeatureTogglesApi = baseFeatureTogglesApi;
    this.properties = properties;
  }

  @Override
  public VaccinationCheckResponse checkVaccinationStatus(VaccinationCheckRequest request) {
    if (!baseFeatureTogglesApi
        .getFeatureToggles()
        .enabledNewFeatures()
        .contains(BaseFeature.VACCINATION_CHECK)) {
      throw new BadRequestException("New feature VACCINATION_CHECK is not enabled");
    }
    guard.guardVaccinationCheck();
    if (properties.isPolytuneActive()) {
      throw new BadRequestException("Direct vaccination check is not active.");
    }
    return vaccinationCheckService.checkVaccinationStatus(request.fileStateIds());
  }
}

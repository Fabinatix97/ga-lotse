/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.schoolentry.api.vaccination.VaccinationCheckApi;
import de.eshg.schoolentry.api.vaccination.VaccinationCheckRequest;
import de.eshg.schoolentry.api.vaccination.VaccinationCheckResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "VaccinationCheck")
public class VaccinationCheckController implements VaccinationCheckApi {

  private final VaccinationCheckService vaccinationCheckService;
  private final BaseFeatureTogglesApi baseFeatureTogglesApi;

  public VaccinationCheckController(
      VaccinationCheckService vaccinationCheckService,
      BaseFeatureTogglesApi baseFeatureTogglesApi) {
    this.vaccinationCheckService = vaccinationCheckService;
    this.baseFeatureTogglesApi = baseFeatureTogglesApi;
  }

  @Override
  public VaccinationCheckResponse checkVaccinationStatus(VaccinationCheckRequest request) {
    if (!baseFeatureTogglesApi
        .getFeatureToggles()
        .enabledNewFeatures()
        .contains(BaseFeature.VACCINATION_CHECK)) {
      throw new BadRequestException("New feature VACCINATION_CHECK is not enabled");
    }
    return vaccinationCheckService.checkVaccinationStatus(request.fileStateIds());
  }
}

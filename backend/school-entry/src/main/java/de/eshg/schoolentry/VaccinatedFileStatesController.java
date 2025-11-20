/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.schoolentry.api.vaccination.GetVaccinatedFileStateIdsResponse;
import de.eshg.schoolentry.api.vaccination.VaccinatedFileStatesApi;
import de.eshg.schoolentry.config.SchoolEntryProperties;
import de.eshg.schoolentry.domain.repository.PersonRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Set;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "VaccinatedFileStates")
public class VaccinatedFileStatesController implements VaccinatedFileStatesApi {

  private final BaseFeatureTogglesApi baseFeatureTogglesApi;
  private final SchoolEntryProperties properties;
  private final PersonRepository personRepository;

  public VaccinatedFileStatesController(
      BaseFeatureTogglesApi baseFeatureTogglesApi,
      SchoolEntryProperties properties,
      PersonRepository personRepository) {
    this.baseFeatureTogglesApi = baseFeatureTogglesApi;
    this.properties = properties;
    this.personRepository = personRepository;
  }

  @Transactional(readOnly = true)
  @Override
  public GetVaccinatedFileStateIdsResponse getVaccinatedFileStateIds() {
    assertFeatureTogglesEnabled();
    return new GetVaccinatedFileStateIdsResponse(
        personRepository.findAllVaccinatedChildrenFileStateIds());
  }

  private void assertFeatureTogglesEnabled() {
    Set<BaseFeature> enabledNewFeatures =
        baseFeatureTogglesApi.getFeatureToggles().enabledNewFeatures();
    if (!enabledNewFeatures.contains(BaseFeature.VACCINATION_CHECK)) {
      throw new BadRequestException("New feature VACCINATION_CHECK is not enabled");
    }
    if (!properties.isPolytuneActive()) {
      throw new BadRequestException("Vaccination check is not in polytune mode");
    }
  }
}

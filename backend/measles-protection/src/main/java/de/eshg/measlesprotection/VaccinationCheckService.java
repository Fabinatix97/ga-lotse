/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.config.PublicConfigApi;
import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.measlesprotection.api.MeaslesVaccinationStatusDto;
import de.eshg.measlesprotection.api.MeaslesVaccinationStatusUpdateModeDto;
import de.eshg.schoolentry.api.vaccination.VaccinationCheckApi;
import de.eshg.schoolentry.api.vaccination.VaccinationCheckRequest;
import de.eshg.schoolentry.api.vaccination.VaccinationCheckResponse;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class VaccinationCheckService {

  private static final Logger log = LoggerFactory.getLogger(VaccinationCheckService.class);
  private final PersonApi personApi;
  private final PublicConfigApi publicConfigApi;
  private final VaccinationCheckApi vaccinationCheckApi;
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final Clock clock;
  private final BaseFeatureTogglesApi baseFeatureTogglesApi;

  public VaccinationCheckService(
      PersonApi personApi,
      PublicConfigApi publicConfigApi,
      VaccinationCheckApi vaccinationCheckApi,
      ModuleClientAuthenticator moduleClientAuthenticator,
      Clock clock,
      BaseFeatureTogglesApi baseFeatureTogglesApi) {
    this.personApi = personApi;
    this.publicConfigApi = publicConfigApi;
    this.vaccinationCheckApi = vaccinationCheckApi;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.clock = clock;
    this.baseFeatureTogglesApi = baseFeatureTogglesApi;
  }

  public MeaslesVaccinationStatusDto checkVaccinationStatus(UUID fileStateId) {
    if (vaccinationCheckEnabled()) {
      final List<UUID> fileStateIds = getAssociatedFileStateIds(fileStateId);
      return Optional.ofNullable(
              moduleClientAuthenticator.doWithReplacedModuleClientAuthentication(
                  () -> checkVaccinationStatus(new VaccinationCheckRequest(fileStateIds))))
          .map(this::mapToMeaslesVaccinationStatusDto)
          .orElse(null);
    } else {
      return null;
    }
  }

  private boolean vaccinationCheckEnabled() {
    return baseFeatureTogglesApi
            .getFeatureToggles()
            .enabledNewFeatures()
            .contains(BaseFeature.VACCINATION_CHECK)
        && publicConfigApi.getConfig().activeModules().contains(BusinessModule.SCHOOL_ENTRY);
  }

  private List<UUID> getAssociatedFileStateIds(UUID fileStateId) {
    return personApi.getPersonFileStateIdsAssociatedWithFileState(fileStateId).fileStateIds();
  }

  private MeaslesVaccinationStatusDto mapToMeaslesVaccinationStatusDto(
      VaccinationCheckResponse response) {
    return new MeaslesVaccinationStatusDto(
        response.status(), LocalDateTime.now(clock), MeaslesVaccinationStatusUpdateModeDto.NONE);
  }

  private VaccinationCheckResponse checkVaccinationStatus(VaccinationCheckRequest request) {
    try {
      return vaccinationCheckApi.checkVaccinationStatus(request);
    } catch (Exception e) {
      log.error(
          "Error during remote call to vaccinationCheckApi#checkVaccinationStatus of module school-entry",
          e);
      return null;
    }
  }
}

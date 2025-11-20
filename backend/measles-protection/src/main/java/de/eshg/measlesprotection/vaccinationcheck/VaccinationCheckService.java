/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.vaccinationcheck;

import de.eshg.base.config.PublicConfigApi;
import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.lib.common.BusinessModule;
import de.eshg.measlesprotection.MeaslesProtectionProperties;
import de.eshg.measlesprotection.api.MeaslesVaccinationStatusDto;
import de.eshg.measlesprotection.persistence.db.Person;
import org.springframework.stereotype.Service;

@Service
public class VaccinationCheckService {

  private final DirectVaccinationCheckService directVaccinationCheckService;
  private final PolytuneVaccinationCheckService polytuneVaccinationCheckService;
  private final BaseFeatureTogglesApi baseFeatureTogglesApi;
  private final PublicConfigApi publicConfigApi;
  private final MeaslesProtectionProperties properties;

  public VaccinationCheckService(
      DirectVaccinationCheckService directVaccinationCheckService,
      PolytuneVaccinationCheckService polytuneVaccinationCheckService,
      BaseFeatureTogglesApi baseFeatureTogglesApi,
      PublicConfigApi publicConfigApi,
      MeaslesProtectionProperties properties) {
    this.directVaccinationCheckService = directVaccinationCheckService;
    this.polytuneVaccinationCheckService = polytuneVaccinationCheckService;
    this.baseFeatureTogglesApi = baseFeatureTogglesApi;
    this.publicConfigApi = publicConfigApi;
    this.properties = properties;
  }

  public MeaslesVaccinationStatusDto checkVaccinationStatus(Person person) {
    if (vaccinationCheckEnabled()) {
      if (properties.isPolytuneActive()) {
        return polytuneVaccinationCheckService.getVaccinationStatusViaPolytune(person);
      } else {
        return directVaccinationCheckService.getVaccinationStatusFromSchoolEntry(person);
      }
    } else {
      return null;
    }
  }

  public boolean isFullyVaccinated(Person person) {
    MeaslesVaccinationStatusDto vaccinationCheckResult = checkVaccinationStatus(person);
    if (vaccinationCheckResult == null || vaccinationCheckResult.vaccination() == null) {
      return false;
    } else {
      return vaccinationCheckResult.vaccination().complete();
    }
  }

  public MeaslesVaccinationStatusDto requestVaccinationStatusUpdate(Person person) {
    return polytuneVaccinationCheckService.requestVaccinationStatusUpdate(person);
  }

  private boolean vaccinationCheckEnabled() {
    return baseFeatureTogglesApi
            .getFeatureToggles()
            .enabledNewFeatures()
            .contains(BaseFeature.VACCINATION_CHECK)
        && publicConfigApi.getConfig().activeModules().contains(BusinessModule.SCHOOL_ENTRY);
  }
}

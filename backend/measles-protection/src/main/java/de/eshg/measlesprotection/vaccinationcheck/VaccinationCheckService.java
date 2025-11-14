/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.vaccinationcheck;

import de.eshg.base.config.PublicConfigApi;
import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.lib.common.BusinessModule;
import de.eshg.measlesprotection.api.MeaslesVaccinationStatusDto;
import de.eshg.measlesprotection.persistence.db.Person;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class VaccinationCheckService {

  private final DirectVaccinationCheckService directVaccinationCheckService;
  private final PolytuneVaccinationCheckService polytuneVaccinationCheckService;
  private final BaseFeatureTogglesApi baseFeatureTogglesApi;
  private final PublicConfigApi publicConfigApi;

  public VaccinationCheckService(
      DirectVaccinationCheckService directVaccinationCheckService,
      PolytuneVaccinationCheckService polytuneVaccinationCheckService,
      BaseFeatureTogglesApi baseFeatureTogglesApi,
      PublicConfigApi publicConfigApi) {
    this.directVaccinationCheckService = directVaccinationCheckService;
    this.polytuneVaccinationCheckService = polytuneVaccinationCheckService;
    this.baseFeatureTogglesApi = baseFeatureTogglesApi;
    this.publicConfigApi = publicConfigApi;
  }

  public MeaslesVaccinationStatusDto checkVaccinationStatus(Person person) {
    Set<BaseFeature> features = baseFeatureTogglesApi.getFeatureToggles().enabledNewFeatures();
    if (vaccinationCheckEnabled(features)) {
      if (polytuneEnabled(features)) {
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

  private boolean vaccinationCheckEnabled(Set<BaseFeature> featureToggles) {
    return featureToggles.contains(BaseFeature.VACCINATION_CHECK)
        && publicConfigApi.getConfig().activeModules().contains(BusinessModule.SCHOOL_ENTRY);
  }

  private boolean polytuneEnabled(Set<BaseFeature> featureToggles) {
    return featureToggles.contains(BaseFeature.POLYTUNE);
  }
}

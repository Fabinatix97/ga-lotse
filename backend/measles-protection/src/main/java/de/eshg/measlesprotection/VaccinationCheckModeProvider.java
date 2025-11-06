/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.base.config.PublicConfigApi;
import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.lib.common.BusinessModule;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class VaccinationCheckModeProvider {

  private final PublicConfigApi publicConfigApi;
  private final BaseFeatureTogglesApi baseFeatureTogglesApi;

  public VaccinationCheckModeProvider(
      PublicConfigApi publicConfigApi, BaseFeatureTogglesApi baseFeatureTogglesApi) {
    this.publicConfigApi = publicConfigApi;
    this.baseFeatureTogglesApi = baseFeatureTogglesApi;
  }

  public VaccinationCheckMode vaccinationCheckMode() {
    Set<BaseFeature> featureToggles =
        baseFeatureTogglesApi.getFeatureToggles().enabledNewFeatures();
    if (vaccinationCheckEnabled(featureToggles)) {
      if (polytuneEnabled(featureToggles)) {
        return VaccinationCheckMode.POLYTUNE;
      } else {
        return VaccinationCheckMode.DIRECT;
      }
    } else {
      return VaccinationCheckMode.DISABLED;
    }
  }

  private boolean vaccinationCheckEnabled(Set<BaseFeature> featureToggles) {
    return featureToggles.contains(BaseFeature.VACCINATION_CHECK)
        && publicConfigApi.getConfig().activeModules().contains(BusinessModule.SCHOOL_ENTRY);
  }

  private boolean polytuneEnabled(Set<BaseFeature> featureToggles) {
    return featureToggles.contains(BaseFeature.POLYTUNE);
  }
}

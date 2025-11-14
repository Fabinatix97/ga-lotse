/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.vaccinationcheck;

import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.schoolentry.api.vaccination.VaccinationCheckApi;
import de.eshg.schoolentry.api.vaccination.VaccinationCheckRequest;
import de.eshg.schoolentry.api.vaccination.VaccinationCheckResponse;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class SchoolEntryVaccinationCheckClient {

  private static final Logger log =
      LoggerFactory.getLogger(SchoolEntryVaccinationCheckClient.class);

  private final VaccinationCheckApi vaccinationCheckApi;
  private final ModuleClientAuthenticator moduleClientAuthenticator;

  public SchoolEntryVaccinationCheckClient(
      VaccinationCheckApi vaccinationCheckApi,
      ModuleClientAuthenticator moduleClientAuthenticator) {
    this.vaccinationCheckApi = vaccinationCheckApi;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
  }

  public Optional<VaccinationCheckResponse> getMeaslesVaccinationStatus(List<UUID> fileStateIds) {
    return moduleClientAuthenticator.doWithReplacedModuleClientAuthentication(
        () -> checkVaccinationStatus(fileStateIds));
  }

  private Optional<VaccinationCheckResponse> checkVaccinationStatus(List<UUID> fileStateIds) {
    try {
      return Optional.of(
          vaccinationCheckApi.checkVaccinationStatus(new VaccinationCheckRequest(fileStateIds)));
    } catch (Exception e) {
      log.error(
          "Error during remote call to vaccinationCheckApi#checkVaccinationStatus of module school-entry",
          e);
      return Optional.empty();
    }
  }
}

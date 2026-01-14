/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.vaccination;

import static de.eshg.schoolentry.api.vaccination.VaccinatedFileStatesApi.BASE_URL;

import de.eshg.rest.service.security.config.BaseUrls.SchoolEntry;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(BASE_URL)
public interface VaccinatedFileStatesApi {

  String BASE_URL = SchoolEntry.VACCINATED_FILE_STATES_CONTROLLER;

  @GetExchange
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Get the ids of all file states which have two measles vaccinations or more"
              + " and for which the vaccination pass was presented")
  GetVaccinatedFileStateIdsResponse getVaccinatedFileStateIds();
}

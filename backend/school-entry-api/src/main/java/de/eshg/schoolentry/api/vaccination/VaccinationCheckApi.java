/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.vaccination;

import static de.eshg.schoolentry.api.vaccination.VaccinationCheckApi.BASE_URL;

import de.eshg.rest.service.security.config.BaseUrls.SchoolEntry;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(url = BASE_URL)
public interface VaccinationCheckApi {

  String BASE_URL = SchoolEntry.VACCINATION_CHECK;

  @PostExchange
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Check if vaccinated")
  VaccinationCheckResponse checkVaccinationStatus(
      @Valid @RequestBody VaccinationCheckRequest request);
}

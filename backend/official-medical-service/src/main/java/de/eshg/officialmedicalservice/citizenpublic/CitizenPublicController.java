/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.citizenpublic;

import de.eshg.officialmedicalservice.citizenpublic.api.GetOpeningHoursResponse;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Collections;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    path = CitizenPublicController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "CitizenPublic")
public class CitizenPublicController {

  public static final String BASE_URL = BaseUrls.OfficialMedicalService.CITIZEN_PUBLIC_API;

  private final OpeningHoursProperties openingHoursProperties;

  public CitizenPublicController(OpeningHoursProperties openingHoursProperties) {
    this.openingHoursProperties = openingHoursProperties;
  }

  @Operation(summary = "Get opening hours.")
  @GetMapping("/opening-hours")
  @Transactional(readOnly = true)
  public GetOpeningHoursResponse getOpeningHours() {

    return new GetOpeningHoursResponse(
        openingHoursProperties.de() == null ? Collections.emptyList() : openingHoursProperties.de(),
        openingHoursProperties.en() == null
            ? Collections.emptyList()
            : openingHoursProperties.en());
  }
}

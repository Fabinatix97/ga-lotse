/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.schoolentry.api.CountryCodeDto;
import de.eshg.schoolentry.api.GetCountryCodesResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(SchoolEntryCountryCodesController.BASE_URL)
@Tag(name = "SchoolEntryCountryCodes")
public class SchoolEntryCountryCodesController {

  public static final String BASE_URL = BaseUrls.SchoolEntry.COUNTRY_CODES_CONTROLLER;

  @GetMapping
  public GetCountryCodesResponse getCountryCodes() {
    Map<String, Integer> countryCodes = new LinkedHashMap<>();
    for (CountryCodeDto code : CountryCodeDto.values()) {
      countryCodes.put(code.name(), code.getCountryGroupCode());
    }
    return new GetCountryCodesResponse(countryCodes);
  }
}

/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.geo;

import de.eshg.inspection.config.InspectionNominatimConfiguration;
import de.eshg.inspection.geo.api.NominatimResponseItem;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class NominatimApiImpl implements NominatimApi {

  private final RestTemplate restTemplate;

  @Value("${de.eshg.inspection.geo.nominatim.baseUrl}")
  private String nominatimBaseUrl;

  public NominatimApiImpl(
      @Autowired @Qualifier(InspectionNominatimConfiguration.NOMINATIM_REST_TEMPLATE)
          RestTemplate restTemplate) {
    this.restTemplate = restTemplate;
  }

  @Override
  public List<NominatimResponseItem> fetch(
      String country, String city, String postalcode, String street) {

    String nominatimUrl = nominatimBaseUrl;

    String urlTemplate =
        UriComponentsBuilder.fromUriString(nominatimUrl)
            .queryParam("country", "{country}")
            .queryParam("city", "{city}")
            .queryParam("postalcode", "{postalcode}")
            .queryParam("street", "{street}")
            .queryParam("format", "{format}")
            .encode()
            .toUriString();

    Map<String, String> queryParameters = new HashMap<>();
    queryParameters.put("country", country);
    queryParameters.put("city", city);
    queryParameters.put("postalcode", postalcode);
    queryParameters.put("street", street);
    queryParameters.put("format", "json");

    ResponseEntity<List<NominatimResponseItem>> nominatimResponse =
        this.restTemplate.exchange(
            urlTemplate,
            HttpMethod.GET,
            new HttpEntity<>(null, null),
            new ParameterizedTypeReference<>() {},
            queryParameters);

    if (!nominatimResponse.getStatusCode().is2xxSuccessful()) {
      throw new BadRequestException(
          ErrorCode.UNEXPECTED_ERROR, "nominatim error " + nominatimResponse.getStatusCode());
    }

    List<NominatimResponseItem> nominatimResponseItems = nominatimResponse.getBody();

    if (nominatimResponseItems == null) {
      throw new BadRequestException(ErrorCode.UNEXPECTED_ERROR, "nominatim response is null");
    }

    return nominatimResponseItems;
  }
}

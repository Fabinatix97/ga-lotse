/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons.logging.filter;

import static de.eshg.rest.service.commons.logging.filter.HeaderFilterUtils.WELL_KNOWN_HEADERS_THAT_CAN_BE_LOGGED;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import java.io.UncheckedIOException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;
import org.zalando.logbook.HttpHeaders;

@Component
public class MaskingResponseFilter {
  private final ObjectMapper objectMapper;

  public MaskingResponseFilter(ObjectMapper objectMapper) {
    this.objectMapper =
        objectMapper.copy().setAnnotationIntrospector(new LoggingDecisionAnnotationIntrospector());
  }

  public String filterResponseBody(Object body) {
    try {
      return objectMapper.writeValueAsString(body);
    } catch (JsonProcessingException e) {
      throw new UncheckedIOException(e);
    }
  }

  public HttpHeaders filterResponseHeaders(HttpServletResponse response) {
    HttpHeaders headers = HttpHeaders.empty();
    for (String header : response.getHeaderNames()) {
      headers = headers.update(header, maskHeader(header, response));
    }
    return headers;
  }

  private List<String> maskHeader(String headerName, HttpServletResponse response) {
    if (WELL_KNOWN_HEADERS_THAT_CAN_BE_LOGGED.contains(headerName.toLowerCase())) {
      return new ArrayList<>(response.getHeaders(headerName));
    }

    return List.of(MaskingSerializer.MASK);
  }
}

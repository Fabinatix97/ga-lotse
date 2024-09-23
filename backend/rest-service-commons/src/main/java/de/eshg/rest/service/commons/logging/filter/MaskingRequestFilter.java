/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons.logging.filter;

import static de.eshg.rest.service.commons.logging.filter.HeaderFilterUtils.WELL_KNOWN_HEADERS_THAT_CAN_BE_LOGGED;
import static java.util.Collections.list;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.rest.service.commons.logging.RequestLoggingUtils;
import jakarta.servlet.http.HttpServletRequest;
import java.io.UncheckedIOException;
import java.util.AbstractMap.SimpleEntry;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;
import java.util.function.UnaryOperator;
import org.springframework.core.annotation.AnnotatedMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import org.zalando.logbook.HttpHeaders;

@Component
public class MaskingRequestFilter {

  private final ObjectMapper objectMapper;

  public MaskingRequestFilter(ObjectMapper objectMapper) {
    this.objectMapper =
        objectMapper.copy().setAnnotationIntrospector(new LoggingDecisionAnnotationIntrospector());
  }

  public String filterRequestBody(Object body) {
    try {
      return objectMapper.writeValueAsString(body);
    } catch (JsonProcessingException e) {
      throw new UncheckedIOException(e);
    }
  }

  public String filterQuery(Map<String, String[]> parameters, AnnotatedMethod handlerMethod) {
    Set<String> allowedQueryParameters =
        RequestLoggingUtils.getNamesOfParametersThatCanBeLogged(handlerMethod);

    UriComponentsBuilder builder = UriComponentsBuilder.fromPath("");
    parameters.entrySet().stream()
        .map(maskUnknownQueryParameters(allowedQueryParameters))
        .forEach(
            maskedParameter ->
                builder.queryParam(
                    maskedParameter.getKey(), Arrays.asList(maskedParameter.getValue())));

    return Optional.ofNullable(builder.build().getQuery()).orElse("");
  }

  private UnaryOperator<Entry<String, String[]>> maskUnknownQueryParameters(
      Set<String> allowedQueryParameters) {
    return parameter -> {
      if (allowedQueryParameters.contains(parameter.getKey())) {
        return parameter;
      }

      return new SimpleEntry<>(parameter.getKey(), new String[] {MaskingSerializer.MASK});
    };
  }

  public HttpHeaders filterRequestHeader(HttpServletRequest request) {
    HttpHeaders headers = HttpHeaders.empty();
    for (String header : list(request.getHeaderNames())) {
      headers = headers.update(header, maskHeader(header, request));
    }
    return headers;
  }

  private List<String> maskHeader(String header, HttpServletRequest request) {
    if (WELL_KNOWN_HEADERS_THAT_CAN_BE_LOGGED.contains(header.toLowerCase())) {
      return list(request.getHeaders(header));
    }

    return List.of(MaskingSerializer.MASK);
  }
}

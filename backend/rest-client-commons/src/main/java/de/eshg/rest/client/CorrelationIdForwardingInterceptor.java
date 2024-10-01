/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.client;

import de.eshg.logging.LoggingConstants;
import java.io.IOException;
import org.slf4j.MDC;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

public class CorrelationIdForwardingInterceptor implements ClientHttpRequestInterceptor {
  @Override
  public ClientHttpResponse intercept(
      HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
    String correlationId = MDC.get(LoggingConstants.CORRELATION_ID_MDC_KEY);
    if (correlationId != null) {
      request.getHeaders().set(LoggingConstants.CORRELATION_ID_HEADER, correlationId);
    }
    return execution.execute(request, body);
  }
}

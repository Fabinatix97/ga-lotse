/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.client;

import org.apache.hc.client5.http.classic.HttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClientBuilder;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.client.RestClientCustomizer;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestClient;
import org.zalando.logbook.Logbook;
import org.zalando.logbook.httpclient5.LogbookHttpRequestInterceptor;
import org.zalando.logbook.httpclient5.LogbookHttpResponseInterceptor;

@AutoConfiguration
@ConditionalOnProperty(
    name = "de.eshg.rest.client.request-response-logging-enabled",
    havingValue = "true",
    matchIfMissing = true)
@PropertySource("classpath:/common-logbook-client.properties")
public class RequestResponseLoggingRestClientCustomizer implements RestClientCustomizer {

  private final Logbook logbook;

  public RequestResponseLoggingRestClientCustomizer(Logbook logbook) {
    this.logbook = logbook;
  }

  @Override
  public void customize(RestClient.Builder restClientBuilder) {
    HttpClient httpClient =
        HttpClientBuilder.create()
            .addRequestInterceptorFirst(new LogbookHttpRequestInterceptor(logbook))
            .addResponseInterceptorFirst(new LogbookHttpResponseInterceptor())
            .build();

    HttpComponentsClientHttpRequestFactory requestFactory =
        new HttpComponentsClientHttpRequestFactory(httpClient);

    restClientBuilder.requestFactory(requestFactory);
  }
}

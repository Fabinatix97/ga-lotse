/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey.client;

import de.eshg.filejockey.FileIoApi;
import de.eshg.rest.client.AcceptLanguageForwardingInterceptor;
import de.eshg.rest.client.BearerAuthInterceptor;
import de.eshg.rest.client.CorrelationIdForwardingInterceptor;
import de.eshg.rest.client.SimpleModelAttributeArgumentResolver;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.convert.ConversionService;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@AutoConfiguration
@EnableConfigurationProperties(FileJockeyClientProperties.class)
@PropertySource("classpath:/file-jockey-client-default.properties")
public class FileJockeyClientAutoConfiguration {

  private final RestClient.Builder restClientBuilder;
  private final FileJockeyClientProperties properties;
  private final ConversionService conversionService;

  public FileJockeyClientAutoConfiguration(
      RestClient.Builder restClientBuilder,
      FileJockeyClientProperties properties,
      ConversionService conversionService) {
    this.restClientBuilder = restClientBuilder;
    this.properties = properties;
    this.conversionService = conversionService;
  }

  @Bean
  FileIoApi fileIoApi() {
    return createClient(FileIoApi.class);
  }

  private <T> T createClient(Class<T> apiClass) {
    RestClient restClient =
        restClientBuilder
            .baseUrl(properties.getServiceUrl())
            .requestInterceptor(new BearerAuthInterceptor())
            .requestInterceptor(new CorrelationIdForwardingInterceptor())
            .requestInterceptor(new AcceptLanguageForwardingInterceptor())
            .build();
    RestClientAdapter restClientAdapter = RestClientAdapter.create(restClient);

    HttpServiceProxyFactory httpServiceProxyFactory =
        HttpServiceProxyFactory.builderFor(restClientAdapter)
            .conversionService(conversionService)
            .customArgumentResolver(new SimpleModelAttributeArgumentResolver(conversionService))
            .build();

    return httpServiceProxyFactory.createClient(apiClass);
  }
}

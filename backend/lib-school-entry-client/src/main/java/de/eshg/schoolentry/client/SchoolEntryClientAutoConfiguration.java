/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.client;

import de.eshg.rest.client.AcceptLanguageForwardingInterceptor;
import de.eshg.rest.client.BearerAuthInterceptor;
import de.eshg.rest.client.CorrelationIdForwardingInterceptor;
import de.eshg.rest.client.SimpleModelAttributeArgumentResolver;
import de.eshg.schoolentry.api.testhelper.SchoolEntryTestHelperApi;
import de.eshg.schoolentry.api.vaccination.VaccinationCheckApi;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperAutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.convert.ConversionService;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@AutoConfiguration(before = TestHelperAutoConfiguration.class)
@EnableConfigurationProperties(SchoolEntryClientProperties.class)
@PropertySource("classpath:/school-entry-client-default.properties")
public class SchoolEntryClientAutoConfiguration {

  private final RestClient.Builder restClientBuilder;
  private final SchoolEntryClientProperties properties;
  private final ConversionService conversionService;

  public SchoolEntryClientAutoConfiguration(
      RestClient.Builder restClientBuilder,
      SchoolEntryClientProperties properties,
      ConversionService conversionService) {
    this.restClientBuilder = restClientBuilder;
    this.properties = properties;
    this.conversionService = conversionService;
  }

  @Bean
  VaccinationCheckApi vaccinationCheckApi() {
    return createClient(VaccinationCheckApi.class);
  }

  @ConditionalOnTestHelperEnabled
  @Bean
  SchoolEntryTestHelperApi schoolEntryTestHelperApi() {
    return createClient(SchoolEntryTestHelperApi.class);
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

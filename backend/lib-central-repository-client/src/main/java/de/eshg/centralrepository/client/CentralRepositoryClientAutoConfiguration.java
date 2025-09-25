/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.centralrepository.client;

import de.eshg.lib.centralrepository.CentralRepositoryApi;
import de.eshg.rest.client.BearerAuthInterceptor;
import de.eshg.rest.client.CorrelationIdForwardingInterceptor;
import de.eshg.rest.client.SimpleModelAttributeArgumentResolver;
import io.micrometer.common.util.StringUtils;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.convert.ConversionService;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@AutoConfiguration
@EnableConfigurationProperties(CentralRepositoryClientProperties.class)
@PropertySource("classpath:/central-repository-client-default.properties")
public class CentralRepositoryClientAutoConfiguration {

  @Bean
  CentralRepositoryApi centralRepositoryApi(
      RestClient.Builder restClientBuilder,
      CentralRepositoryClientProperties properties,
      ConversionService conversionService) {

    restClientBuilder
        .baseUrl(properties.getServiceUrl())
        .requestInterceptor(new BearerAuthInterceptor())
        .requestInterceptor(new CorrelationIdForwardingInterceptor());

    if (StringUtils.isNotEmpty(properties.getMockCertSubjectCn())) {
      restClientBuilder.requestInterceptor(
          new CertSubjectForwardingInterceptor(properties.getMockCertSubjectCn()));
    }

    RestClient restClient = restClientBuilder.build();

    RestClientAdapter restClientAdapter = RestClientAdapter.create(restClient);

    return HttpServiceProxyFactory.builderFor(restClientAdapter)
        .conversionService(conversionService)
        .customArgumentResolver(new SimpleModelAttributeArgumentResolver(conversionService))
        .build()
        .createClient(CentralRepositoryApi.class);
  }
}

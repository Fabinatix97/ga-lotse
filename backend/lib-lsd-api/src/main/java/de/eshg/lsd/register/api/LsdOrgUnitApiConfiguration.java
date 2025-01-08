/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.register.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@AutoConfiguration
public class LsdOrgUnitApiConfiguration {

  @Bean
  @ConditionalOnMissingBean
  @ConditionalOnProperty("eshg.lsd.baseUrl")
  LsdOrgUnitApi lsdOrgUnitClient(
      RestClient.Builder restClientBuilder, @Value("${eshg.lsd.baseUrl}") String baseUrl) {
    RestClient restClient = restClientBuilder.baseUrl(baseUrl).build();
    RestClientAdapter restClientAdapter = RestClientAdapter.create(restClient);

    HttpServiceProxyFactory httpServiceProxyFactory =
        HttpServiceProxyFactory.builderFor(restClientAdapter).build();

    return httpServiceProxyFactory.createClient(LsdOrgUnitApi.class);
  }
}

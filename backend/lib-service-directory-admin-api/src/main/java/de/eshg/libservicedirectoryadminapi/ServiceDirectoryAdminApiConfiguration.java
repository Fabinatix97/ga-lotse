/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi;

import de.eshg.libservicedirectoryadminapi.api.testhelper.ServiceDirectoryTestHelperApi;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.http.client.ClientHttpRequestFactoryBuilder;
import org.springframework.boot.http.client.ClientHttpRequestFactorySettings;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@AutoConfiguration
public class ServiceDirectoryAdminApiConfiguration {

  @Bean
  @ConditionalOnTestHelperEnabled
  @ConditionalOnProperty("eshg.servicedirectory.baseUrl")
  public ServiceDirectoryTestHelperApi serviceDirectoryTestHelperClient(
      RestClient.Builder restClientBuilder,
      @Value("${eshg.servicedirectory.baseUrl}") String serviceDirectoryUrl) {
    RestClient restClient =
        restClientBuilder
            .baseUrl(serviceDirectoryUrl)
            .requestFactory(
                ClientHttpRequestFactoryBuilder.detect()
                    .build(
                        ClientHttpRequestFactorySettings.defaults()
                            .withReadTimeout(Duration.ofMinutes(1))))
            .build();
    RestClientAdapter restClientAdapter = RestClientAdapter.create(restClient);

    HttpServiceProxyFactory httpServiceProxyFactory =
        HttpServiceProxyFactory.builderFor(restClientAdapter).build();

    return httpServiceProxyFactory.createClient(ServiceDirectoryTestHelperApi.class);
  }
}

/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi;

import de.eshg.libservicedirectoryadminapi.api.testhelper.ServiceDirectoryTestHelperApi;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.client.ClientHttpRequestFactories;
import org.springframework.boot.web.client.ClientHttpRequestFactorySettings;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClient.Builder;
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
    return createClient(
        restClientBuilder, serviceDirectoryUrl, ServiceDirectoryTestHelperApi.class);
  }

  @Bean
  @ConditionalOnMissingBean
  private static <T> T createClient(
      Builder restClientBuilder, String serviceDirectoryUrl, Class<T> api) {
    RestClient restClient =
        restClientBuilder
            .baseUrl(serviceDirectoryUrl)
            .requestFactory(
                ClientHttpRequestFactories.get(
                    ClientHttpRequestFactorySettings.DEFAULTS.withReadTimeout(
                        Duration.ofMinutes(1))))
            .build();
    RestClientAdapter restClientAdapter = RestClientAdapter.create(restClient);

    HttpServiceProxyFactory httpServiceProxyFactory =
        HttpServiceProxyFactory.builderFor(restClientAdapter).build();

    return httpServiceProxyFactory.createClient(api);
  }

  // TODO: replace this with common import
  @Target({ElementType.TYPE, ElementType.METHOD})
  @Retention(RetentionPolicy.RUNTIME)
  @Profile("test-helper")
  public @interface ConditionalOnTestHelperEnabled {}
}

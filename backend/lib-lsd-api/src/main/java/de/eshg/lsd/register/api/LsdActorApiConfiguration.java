/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.register.api;

import java.util.function.Supplier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@AutoConfiguration
public class LsdActorApiConfiguration {

  @Bean
  @ConditionalOnMissingBean
  @ConditionalOnProperty("eshg.lsd.baseUrl")
  public LsdActorApi lsdActorClient(
      RestClient.Builder restClientBuilder,
      @Value("${eshg.lsd.baseUrl}") String baseUrl,
      BearerAuthTokenSupplier bearerAuthTokenSupplier) {
    RestClient restClient =
        restClientBuilder
            .baseUrl(baseUrl)
            .requestInterceptor(bearerAuthInterceptor(bearerAuthTokenSupplier))
            .build();
    RestClientAdapter restClientAdapter = RestClientAdapter.create(restClient);

    HttpServiceProxyFactory httpServiceProxyFactory =
        HttpServiceProxyFactory.builderFor(restClientAdapter).build();

    return httpServiceProxyFactory.createClient(LsdActorApi.class);
  }

  private static ClientHttpRequestInterceptor bearerAuthInterceptor(
      BearerAuthTokenSupplier bearerAuthTokenSupplier) {
    return (request, body, execution) -> {
      request.getHeaders().setBearerAuth(bearerAuthTokenSupplier.get());
      return execution.execute(request, body);
    };
  }

  public interface BearerAuthTokenSupplier extends Supplier<String> {}
}

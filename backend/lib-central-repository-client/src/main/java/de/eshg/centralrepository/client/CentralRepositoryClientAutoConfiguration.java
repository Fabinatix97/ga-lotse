/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.centralrepository.client;

import de.eshg.rest.client.AccessTokenForwardingInterceptor;
import io.micrometer.common.util.StringUtils;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.web.client.RestClient;

@AutoConfiguration
@EnableConfigurationProperties(CentralRepositoryClientProperties.class)
@PropertySource("classpath:/central-repository-client-default.properties")
public class CentralRepositoryClientAutoConfiguration {

  @Bean
  CentralRepositoryRestClient centralRepositoryRestClient(
      RestClient.Builder restClientBuilder,
      CentralRepositoryClientProperties properties,
      Environment env) {

    restClientBuilder
        .baseUrl(properties.getServiceUrl())
        .requestInterceptor(new AccessTokenForwardingInterceptor());

    if (StringUtils.isNotEmpty(properties.getMockCertSubjectCn())) {
      restClientBuilder.requestInterceptor(
          new CertSubjectForwardingInterceptor(properties.getMockCertSubjectCn()));
    }

    return new CentralRepositoryRestClient(restClientBuilder.build());
  }
}

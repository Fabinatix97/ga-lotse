/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog.spring;

import de.eshg.auditlog.AuditLogArchivingApi;
import de.eshg.lib.auditlog.AtomicUuidProvider;
import de.eshg.lib.auditlog.AuditLogArchiving;
import de.eshg.lib.auditlog.AuditLogTestHelperService;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.auditlog.DefaultUuidProvider;
import de.eshg.lib.auditlog.config.AuditLogConfig;
import de.eshg.rest.client.AccessTokenForwardingInterceptor;
import de.eshg.rest.client.CorrelationIdForwardingInterceptor;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@AutoConfiguration
@PropertySource("classpath:/auditlog-default.properties")
@EnableConfigurationProperties(AuditLogConfig.class)
@Import(
    value = {
      AuditLogger.class,
      AuditLogArchiving.class,
      AuditLogScheduledArchivingConfiguration.class,
      DefaultUuidProvider.class,
      AtomicUuidProvider.class,
      AuditLogTestHelperService.class
    })
public class AuditLogAutoConfiguration {

  @Bean
  @Primary
  public AuditLogArchivingApi auditLogApi(
      AuditLogConfig auditLogConfig, RestClient.Builder restClientBuilder) {
    RestClient restTemplate =
        restClientBuilder
            .baseUrl(auditLogConfig.getServiceUrl())
            .requestInterceptor(new AccessTokenForwardingInterceptor())
            .requestInterceptor(new CorrelationIdForwardingInterceptor())
            .build();

    RestClientAdapter restClientAdapter = RestClientAdapter.create(restTemplate);

    HttpServiceProxyFactory httpServiceProxyFactory =
        HttpServiceProxyFactory.builderFor(restClientAdapter).build();

    return httpServiceProxyFactory.createClient(AuditLogArchivingApi.class);
  }
}

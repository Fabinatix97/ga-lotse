/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.rest.service.security.config.ChatManagementPublicSecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;
import org.zalando.logbook.Logbook;
import org.zalando.logbook.spring.LogbookClientHttpRequestInterceptor;

@SpringBootApplication
@ConfigurationPropertiesScan
@Import(ChatManagementPublicSecurityConfig.class)
public class ChatManagementApplication {

  public static final String SYNAPSE_REST_TEMPLATE = "SynapseRestTemplate";

  @Bean(SYNAPSE_REST_TEMPLATE)
  public RestTemplate synapseRestTemplate(
      RestTemplateBuilder restTemplateBuilder, Logbook logbook) {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    return restTemplateBuilder
        .messageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
        .additionalInterceptors(new LogbookClientHttpRequestInterceptor(logbook))
        .build();
  }

  public static void main(String[] args) {
    SpringApplication.run(ChatManagementApplication.class, args);
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.openapi;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.core.jackson.ModelResolver;
import java.time.Year;
import org.openapitools.jackson.nullable.JsonNullable;
import org.springdoc.core.converters.PolymorphicModelConverter;
import org.springdoc.core.providers.ObjectMapperProvider;
import org.springdoc.core.utils.SpringDocUtils;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;

@AutoConfiguration
@PropertySource("classpath:/common-openapi.properties")
public class OpenApiAutoConfiguration {

  static {
    // Make @Schema(enumAsRef = true) the default for all enums.
    // See https://github.com/springdoc/springdoc-openapi/issues/232
    io.swagger.v3.core.jackson.ModelResolver.enumsAsRef = true;

    SpringDocUtils config = SpringDocUtils.getConfig();

    config.addSimpleTypesForParameterObject(Year.class);
    config.addResponseWrapperToIgnore(JsonNullable.class);
  }

  @Bean
  public ModelResolver modelResolver(ObjectMapper objectMapper) {
    return new ModelResolver(
        objectMapper
            .copy()
            .setAnnotationIntrospector(
                new RegisteredSubtypeAwareJacksonAnnotationIntrospector(objectMapper)));
  }

  @Bean
  public PolymorphicModelConverter extendedPolymorphicModelConverter(
      ObjectMapperProvider objectMapperProvider, ObjectMapper objectMapper) {
    return new DeepPolymorphicModelConverter(objectMapperProvider, objectMapper.copy());
  }
}

/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import de.eshg.domain.model.serialization.SerializationObjectMapperConfigurer;
import de.eshg.inspection.common.persistence.MediaFileContentSerializer;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import de.eshg.lib.keycloak.ModuleMemberGroup;
import java.util.function.BiConsumer;
import java.util.function.UnaryOperator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InspectionProcedureConfiguration {

  @Bean
  ModuleMemberGroup moduleMemberGroup() {
    return ModuleMemberGroup.INSPECTION;
  }

  @Bean
  ModuleLeaderRole moduleLeaderRole() {
    return ModuleLeaderRole.INSPECTION_LEADER;
  }

  @Bean
  SerializationObjectMapperConfigurer serializationObjectMapperConfigurer() {
    return new SerializationObjectMapperConfigurer() {
      @Override
      public void configure(
          ObjectMapper objectMapper,
          BiConsumer<String, byte[]> fileContentConsumer,
          UnaryOperator<String> collisionFreeFileNameCreation) {
        MediaFileContentSerializer serializer =
            new MediaFileContentSerializer(fileContentConsumer, collisionFreeFileNameCreation);
        objectMapper.registerModule(new SimpleModule().addSerializer(serializer));
      }
    };
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.module.SimpleModule;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;

@AutoConfiguration
@PropertySource("classpath:/jackson-common.properties")
public class JacksonAutoConfiguration {

  @Bean
  public Module stableCollectionModule() {
    SimpleModule module = new SimpleModule();
    module.addAbstractTypeMapping(Set.class, LinkedHashSet.class);
    module.addAbstractTypeMapping(Map.class, LinkedHashMap.class);
    return module;
  }
}

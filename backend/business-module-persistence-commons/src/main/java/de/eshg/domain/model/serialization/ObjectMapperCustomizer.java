/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.domain.model.serialization;

import com.fasterxml.jackson.databind.ObjectMapper;

@FunctionalInterface
public interface ObjectMapperCustomizer {

  static ObjectMapperCustomizer doNothing() {
    return objectMapper -> {};
  }

  void customize(ObjectMapper objectMapper);

  static ObjectMapperCustomizer combine(ObjectMapperCustomizer... objectMapperCustomizers) {
    return objectMapper -> {
      for (ObjectMapperCustomizer customizer : objectMapperCustomizers) {
        customizer.customize(objectMapper);
      }
    };
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.domain.model.serialization;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.function.BiConsumer;
import java.util.function.UnaryOperator;

public interface SerializationObjectMapperConfigurer {
  void configure(
      ObjectMapper objectMapper,
      BiConsumer<String, byte[]> fileContentConsumer,
      UnaryOperator<String> collisionFreeFileNameCreation);
}

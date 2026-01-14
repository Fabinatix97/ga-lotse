/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.domain.model.serialization;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

public record FileContentSerializingCustomizer(ZipFileWrapper zipFileWrapper)
    implements ObjectMapperCustomizer {

  @Override
  public void customize(ObjectMapper objectMapper) {
    objectMapper.registerModule(createFileContentSerializationModule(zipFileWrapper));
  }

  private static SimpleModule createFileContentSerializationModule(ZipFileWrapper zipFileWrapper) {
    return new SimpleModule()
        .addSerializer(
            new FileContentSerializer(
                zipFileWrapper::addEntry, zipFileWrapper::getCollisionFreeFileName));
  }
}

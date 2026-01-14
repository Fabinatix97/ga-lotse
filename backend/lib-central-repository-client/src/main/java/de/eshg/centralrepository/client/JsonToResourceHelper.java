/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.centralrepository.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.ByteArrayInputStream;
import org.springframework.core.io.InputStreamResource;

public class JsonToResourceHelper {

  private JsonToResourceHelper() {}

  public static ResourceStream createResourceWithSizeForJsonString(
      Object object, ObjectMapper objectMapper) {
    byte[] json;
    try {
      json = objectMapper.writeValueAsBytes(object);
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }
    return new ResourceStream(new InputStreamResource(new ByteArrayInputStream(json)), json.length);
  }

  public record ResourceStream(InputStreamResource stream, long size) {}
}

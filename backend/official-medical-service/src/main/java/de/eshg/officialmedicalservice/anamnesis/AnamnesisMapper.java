/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.anamnesis;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.nio.charset.StandardCharsets;
import org.springframework.stereotype.Component;

@Component
public class AnamnesisMapper {
  private final ObjectMapper objectMapper;

  public AnamnesisMapper(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  public AnamnesisDto bytesToAnamnesis(byte[] bytes) {
    try {
      return objectMapper.readValue(new String(bytes, StandardCharsets.UTF_8), AnamnesisDto.class);
    } catch (JsonProcessingException e) {
      throw new BadRequestException(ErrorCode.BAD_REQUEST, "Anamnesis is malformed");
    }
  }

  public byte[] anamnesisToBytes(AnamnesisDto anamnesis) {
    try {
      return objectMapper
          .writerWithDefaultPrettyPrinter()
          .writeValueAsString(anamnesis)
          .getBytes(StandardCharsets.UTF_8);
    } catch (JsonProcessingException e) {
      throw new BadRequestException(ErrorCode.BAD_REQUEST, "Anamnesis is malformed");
    }
  }
}

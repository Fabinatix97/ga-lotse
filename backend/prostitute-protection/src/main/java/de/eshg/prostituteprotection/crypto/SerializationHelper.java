/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.crypto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class SerializationHelper {

  private final ObjectMapper objectMapper;

  SerializationHelper(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  byte[] serialize(DecryptedPersonalDataDto decryption) {
    try {
      return objectMapper.writeValueAsBytes(decryption);
    } catch (JsonProcessingException e) {
      throw new PersonalDataEncryptionException("Failed to serialize personal data", e);
    }
  }

  DecryptedPersonalDataDto deserialize(byte[] data) {
    try {
      return objectMapper.readValue(data, DecryptedPersonalDataDto.class);
    } catch (Exception e) {
      throw new PersonalDataDecryptionException("Failed to deserialize personal data", e);
    }
  }
}

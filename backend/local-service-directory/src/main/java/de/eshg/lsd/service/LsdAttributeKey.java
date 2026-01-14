/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.service;

import de.eshg.lsd.register.api.ActorTypeDto;
import java.util.*;

public enum LsdAttributeKey {
  CERTIFICATE("eshg.actor.certificate", 10_000),

  // legacy:
  CERTIFICATE_VALUE("eshg.actor.certificate.value", 10_000),
  CERTIFICATE_SIGNATURE("eshg.actor.certificate.signature", 10_000),

  READABLE_NAME("eshg.actor.readableName", null),
  HOST_NAME("eshg.actor.hostName", null),

  TYPE("eshg.actor.type", null);

  private final String key;
  private final Integer maxLength;

  LsdAttributeKey(String key, Integer maxLength) {
    this.key = key;
    this.maxLength = maxLength;
  }

  public String getKey() {
    return key;
  }

  public Integer getMaxLength() {
    return maxLength;
  }

  public static Map<String, List<String>> mapOf(
      ActorTypeDto type, String readableName, String hostName) {
    Map<String, List<String>> result = new HashMap<>();
    result.put(TYPE.getKey(), List.of(type.name()));
    result.put(READABLE_NAME.getKey(), List.of(readableName));
    result.put(HOST_NAME.getKey(), List.of(hostName));
    return result;
  }
}

/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.service;

import de.eshg.lsd.register.api.ActorTypeDto;
import java.util.*;

public enum LsdAttributeKey {
  CERTIFICATE_VALUE("eshg.actor.certificate.value"),
  CERTIFICATE_SIGNATURE("eshg.actor.certificate.signature"),
  READABLE_NAME("eshg.actor.readableName"),
  HOST_NAME("eshg.actor.hostName"),

  TYPE("eshg.actor.type");

  private final String key;

  LsdAttributeKey(String key) {
    this.key = key;
  }

  public String getKey() {
    return key;
  }

  public static Map<String, List<String>> mapOf(
      String certificate,
      String signature,
      ActorTypeDto type,
      String readableName,
      String hostName) {
    Map<String, List<String>> result = new HashMap<>();
    result.put(CERTIFICATE_VALUE.getKey(), List.of(certificate));
    result.put(CERTIFICATE_SIGNATURE.getKey(), List.of(signature));
    result.put(TYPE.getKey(), List.of(type.name()));
    result.put(READABLE_NAME.getKey(), List.of(readableName));
    result.put(HOST_NAME.getKey(), List.of(hostName));
    return result;
  }
}

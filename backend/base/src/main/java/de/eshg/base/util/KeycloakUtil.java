/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import de.cronn.commons.lang.StreamUtil;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public final class KeycloakUtil {

  private KeycloakUtil() {
    // util class
  }

  public static Optional<String> getUserAttribute(
      Map<String, List<String>> attributes, String attributeName) {
    if (attributes == null) {
      return Optional.empty();
    }
    return attributes.getOrDefault(attributeName, List.of()).stream()
        .collect(StreamUtil.toSingleOptionalElement());
  }
}

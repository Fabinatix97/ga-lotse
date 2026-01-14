/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.domain.model.serialization;

import com.fasterxml.jackson.databind.JsonNode;

@FunctionalInterface
public interface JsonFilter {
  static JsonFilter doNothing() {
    return jsonNode -> {};
  }

  void filter(JsonNode jsonNode);
}

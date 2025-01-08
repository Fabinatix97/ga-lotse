/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.domain.model.serialization;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.function.BiConsumer;

public interface ZipFilter extends BiConsumer<JsonNode, ZipFileWrapper> {

  default void filter(JsonNode jsonNode, ZipFileWrapper zipFileWrapper) {
    accept(jsonNode, zipFileWrapper);
  }

  default ZipFilter andThen(ZipFilter after) {
    return (l, r) -> {
      accept(l, r);
      after.accept(l, r);
    };
  }
}

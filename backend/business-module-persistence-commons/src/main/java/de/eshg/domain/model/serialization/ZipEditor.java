/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.domain.model.serialization;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.function.Consumer;

@FunctionalInterface
public interface ZipEditor {

  static ZipEditor doNothing() {
    return (jsonNode, zipFile) -> {};
  }

  static ZipEditor makePostProcessor(Consumer<ZipFileWrapper> postProcessor) {
    return new ZipEditor() {
      @Override
      public void filter(JsonNode jsonNode, ZipFileWrapper zipFileWrapper) {}

      @Override
      public void postProcess(ZipFileWrapper zipFileWrapper) {
        postProcessor.accept(zipFileWrapper);
      }
    };
  }

  default void postProcess(ZipFileWrapper zipFileWrapper) {}

  void filter(JsonNode jsonNode, ZipFileWrapper zipFileWrapper);

  default JsonFilter toJsonFilter(ZipFileWrapper zipFileWrapper) {
    return jsonNode -> filter(jsonNode, zipFileWrapper);
  }

  default ZipEditor andThen(ZipEditor after) {
    return new ZipEditor() {
      @Override
      public void filter(JsonNode jsonNode, ZipFileWrapper zipFileWrapper) {
        ZipEditor.this.filter(jsonNode, zipFileWrapper);
        after.filter(jsonNode, zipFileWrapper);
      }

      @Override
      public void postProcess(ZipFileWrapper zipFileWrapper) {
        ZipEditor.this.postProcess(zipFileWrapper);
        after.postProcess(zipFileWrapper);
      }
    };
  }
}

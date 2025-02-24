/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.gdpr;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.eshg.domain.model.serialization.NormalizeSequenceIdCustomizer;
import de.eshg.domain.model.serialization.ObjectMapperCustomizer;
import de.eshg.lib.procedure.domain.model.ProgressEntry;

final class SerializationUtil {

  private SerializationUtil() {}

  static ObjectMapperCustomizer createNormalizedSequenceIdObjectMapperCustomizer() {
    return ObjectMapperCustomizer.combine(
        objectMapper -> objectMapper.addMixIn(ProgressEntry.class, ProgressEntryMixin.class),
        new NormalizeSequenceIdCustomizer());
  }

  private interface ProgressEntryMixin {

    @JsonIgnore
    Long getProcedureId();
  }
}

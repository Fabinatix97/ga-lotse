/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.procedure;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.procedure.model.ManualProgressEntryTypeDto;
import java.util.Comparator;
import java.util.Set;

public record GetProcedureConfigResponse(
    Set<ManualProgressEntryTypeDto> supportedManualProgressEntryTypes) {

  public GetProcedureConfigResponse(
      Set<ManualProgressEntryTypeDto> supportedManualProgressEntryTypes) {
    this.supportedManualProgressEntryTypes =
        supportedManualProgressEntryTypes.stream()
            .sorted(Comparator.comparing(Enum::ordinal))
            .collect(StreamUtil.toLinkedHashSet());
  }
}

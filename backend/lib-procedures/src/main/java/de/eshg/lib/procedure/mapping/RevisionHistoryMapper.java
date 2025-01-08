/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.mapping;

import de.eshg.domain.model.audit.DefaultRevisionEntity;
import de.eshg.lib.procedure.model.AbstractHistoryDto;

public final class RevisionHistoryMapper {

  private RevisionHistoryMapper() {}

  static void mapCommonFields(AbstractHistoryDto historyDto, DefaultRevisionEntity revision) {
    historyDto.setChangedAt(revision.getCreatedAt());
  }
}

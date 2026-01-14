/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.audit;

import de.eshg.base.history.HistoryEntryType;
import org.hibernate.envers.RevisionType;

public final class RevisionHistoryMapper {

  private RevisionHistoryMapper() {}

  public static HistoryEntryType mapTypeToApi(RevisionType type) {
    return switch (type) {
      case null -> null;
      case ADD -> HistoryEntryType.ADD;
      case DEL -> HistoryEntryType.DEL;
      case MOD -> HistoryEntryType.MOD;
    };
  }
}

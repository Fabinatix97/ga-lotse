/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.mapper;

import de.eshg.domain.model.audit.DefaultRevisionEntity;
import java.util.Set;
import org.hibernate.envers.RevisionType;

public final class RevisionEntryWithChange<T> extends RevisionEntry<T> {

  private final Set<String> changedFields;

  public RevisionEntryWithChange(
      T entity, DefaultRevisionEntity revision, RevisionType type, Set<String> changedFields) {
    super(entity, revision, type);
    this.changedFields = changedFields;
  }

  public Set<String> getChangedFields() {
    return changedFields;
  }
}

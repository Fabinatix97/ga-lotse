/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.mapper;

import de.eshg.domain.model.audit.DefaultRevisionEntity;
import org.hibernate.envers.RevisionType;

public sealed class RevisionEntry<T> permits RevisionEntryWithChange {
  private final T entity;
  private final DefaultRevisionEntity revision;
  private final RevisionType type;

  public RevisionEntry(T entity, DefaultRevisionEntity revision, RevisionType type) {
    this.entity = entity;
    this.revision = revision;
    this.type = type;
  }

  public T getEntity() {
    return entity;
  }

  public DefaultRevisionEntity getRevision() {
    return revision;
  }

  public RevisionType getType() {
    return type;
  }
}

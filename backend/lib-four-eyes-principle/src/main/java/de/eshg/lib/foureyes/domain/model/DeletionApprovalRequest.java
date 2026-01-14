/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.foureyes.domain.model;

import de.eshg.domain.model.EntityWithExternalId;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class DeletionApprovalRequest<E extends LockableEntity & EntityWithExternalId>
    extends ApprovalRequest<E> {

  @Override
  public Operation getOperation() {
    return Operation.DELETE;
  }

  public abstract void updateEntity(E entity);
}

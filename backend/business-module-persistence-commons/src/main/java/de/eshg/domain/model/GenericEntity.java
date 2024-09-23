/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Version;

@MappedSuperclass
public abstract class GenericEntity<IdType> {

  @Version
  @Column(nullable = false)
  private Long version;

  public abstract IdType getId();

  public Long getVersion() {
    return version;
  }
}

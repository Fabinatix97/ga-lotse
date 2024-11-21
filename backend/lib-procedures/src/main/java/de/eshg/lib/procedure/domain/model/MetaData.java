/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.domain.model.GenericEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import org.hibernate.envers.Audited;

@MappedSuperclass
@Audited
public abstract class MetaData extends GenericEntity<Long> {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Id
  private Long id;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String description;

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  @Override
  public Long getId() {
    return this.id;
  }

  public abstract MetaData copy();

  protected void copy(MetaData destination) {
    destination.description = this.description;
  }
}

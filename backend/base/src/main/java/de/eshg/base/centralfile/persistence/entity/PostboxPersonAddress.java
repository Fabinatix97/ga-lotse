/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence.entity;

import de.eshg.base.address.persistence.embeddable.EmbeddablePostboxAddress;
import de.eshg.base.address.persistence.entity.DelegatingPostboxAddress;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class PostboxPersonAddress extends PersonAddress implements DelegatingPostboxAddress {

  @Embedded private EmbeddablePostboxAddress embeddedPostboxAddress;

  @Override
  public EmbeddablePostboxAddress getDelegate() {
    if (embeddedPostboxAddress == null) {
      embeddedPostboxAddress = new EmbeddablePostboxAddress();
    }
    return embeddedPostboxAddress;
  }
}

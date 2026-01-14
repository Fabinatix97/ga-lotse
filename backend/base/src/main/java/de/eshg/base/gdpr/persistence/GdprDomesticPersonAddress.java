/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.persistence;

import de.eshg.base.address.persistence.embeddable.EmbeddableDomesticAddress;
import de.eshg.base.address.persistence.entity.DelegatingDomesticAddress;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class GdprDomesticPersonAddress extends GdprPersonAddress
    implements DelegatingDomesticAddress {

  @Embedded private EmbeddableDomesticAddress embeddedDomesticAddress;

  @Override
  public EmbeddableDomesticAddress getDelegate() {
    if (embeddedDomesticAddress == null) {
      embeddedDomesticAddress = new EmbeddableDomesticAddress();
    }
    return embeddedDomesticAddress;
  }
}

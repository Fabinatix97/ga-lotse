/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.examination.labtests;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("HEPA")
public class HepatitisATest extends ImmunizationStatusData {

  public HepatitisATest() {}

  public HepatitisATest(
      Boolean result, String value, String remark, Boolean infection, Boolean vaccineTitre) {
    super(result, value, remark, infection, vaccineTitre);
  }
}

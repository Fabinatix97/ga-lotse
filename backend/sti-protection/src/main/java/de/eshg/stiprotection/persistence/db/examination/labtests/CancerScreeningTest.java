/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.examination.labtests;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("CANCER")
public class CancerScreeningTest extends LabTestData {

  public CancerScreeningTest() {}

  public CancerScreeningTest(Boolean result, String value, String remark) {
    super(result, value, remark);
  }
}

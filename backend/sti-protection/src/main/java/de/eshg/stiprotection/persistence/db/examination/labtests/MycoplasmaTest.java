/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.examination.labtests;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("MYCO")
public class MycoplasmaTest extends SampleSourceData {

  public MycoplasmaTest() {}

  public MycoplasmaTest(
      Boolean result, String value, String remark, Boolean oral, Boolean anal, Boolean urethral) {
    super(result, value, remark, oral, anal, urethral);
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.examination.labtests;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("MPOX")
public class MpoxTest extends LabTestData {
  public MpoxTest() {}

  public MpoxTest(Boolean result, String value, String remark) {
    super(result, value, remark);
  }
}

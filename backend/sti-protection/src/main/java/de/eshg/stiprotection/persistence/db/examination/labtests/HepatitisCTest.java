/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.examination.labtests;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("HEPC")
public class HepatitisCTest extends LabTestData {

  public HepatitisCTest() {}

  public HepatitisCTest(Boolean result, String value, String remark) {
    super(result, value, remark);
  }
}

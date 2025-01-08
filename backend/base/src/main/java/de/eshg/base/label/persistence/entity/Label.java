/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.label.persistence.entity;

import de.eshg.base.inventory.persistence.entity.InventoryItem;
import de.eshg.base.inventory.persistence.entity.InventoryItem_;
import de.eshg.base.resource.persistence.entity.Resource;
import de.eshg.base.resource.persistence.entity.Resource_;
import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Label extends GloballyUniqueEntityBase {

  @Column(nullable = false, unique = true)
  @DataSensitivity(value = SensitivityLevel.PROTECTED)
  private String name;

  @ManyToMany(mappedBy = Resource_.LABELS, fetch = FetchType.LAZY)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  List<Resource> resources = new ArrayList<>();

  @ManyToMany(mappedBy = InventoryItem_.LABELS, fetch = FetchType.LAZY)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  List<InventoryItem> inventoryItems = new ArrayList<>();

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}

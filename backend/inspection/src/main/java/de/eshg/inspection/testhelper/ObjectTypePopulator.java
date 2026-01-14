/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testhelper;

import de.eshg.inspection.objecttype.persistence.CreateObjectTypeHierarchyTask;
import de.eshg.testhelper.population.PopulatorComponent;

@PopulatorComponent
public class ObjectTypePopulator {

  private final CreateObjectTypeHierarchyTask createObjectTypeHierarchyTask;

  public ObjectTypePopulator(CreateObjectTypeHierarchyTask createObjectTypeHierarchyTask) {
    this.createObjectTypeHierarchyTask = createObjectTypeHierarchyTask;
  }

  public void createObjectTypeHierarchy() {
    createObjectTypeHierarchyTask.createObjectTypeHierarchy();
  }
}

/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlist.mapper;

import de.eshg.inspection.packlist.persistence.PacklistElement;
import de.eshg.inspection.packlistdefinition.persistence.PacklistDefinitionElement;

public class PacklistEntityMapper {

  private PacklistEntityMapper() {}

  public static PacklistElement newEntityFrom(PacklistDefinitionElement element) {
    PacklistElement packlistElement = new PacklistElement();
    packlistElement.setPacklistDefinitionElement(element);

    return packlistElement;
  }
}

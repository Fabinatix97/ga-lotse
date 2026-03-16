/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.gdt;

import de.eshg.lib.gdt.v35.model.Gdt35Record;
import de.eshg.schoolentry.business.model.PersonDetailsData;
import de.eshg.schoolentry.domain.model.GdtDriver;
import de.eshg.schoolentry.util.NameAliasGenerator;

public class Gdt35Converter implements GdtConverter<Gdt35Record> {

  @Override
  public Gdt35Record domainToGdt(
      GdtDriver driver,
      String equipmentSelector,
      String correlationId,
      PersonDetailsData child,
      NameAliasGenerator.NameAlias nameAlias) {
    return null;
  }
}

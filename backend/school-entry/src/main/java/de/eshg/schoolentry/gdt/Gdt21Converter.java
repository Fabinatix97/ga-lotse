/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.gdt;

import de.eshg.base.GenderDto;
import de.eshg.lib.gdt.v21.builder.Gdt21RecordBuilder;
import de.eshg.lib.gdt.v21.builder.Gdt21Sex;
import de.eshg.lib.gdt.v21.model.Gdt21Record;
import de.eshg.schoolentry.business.model.PersonDetailsData;
import de.eshg.schoolentry.domain.model.GdtDriver;
import de.eshg.schoolentry.util.NameAliasGenerator;

public class Gdt21Converter implements GdtConverter<Gdt21Record> {

  @Override
  public Gdt21Record domainToGdt(
      GdtDriver driver,
      String equipmentSelector,
      String correlationId,
      PersonDetailsData child,
      NameAliasGenerator.NameAlias nameAlias) {

    return Gdt21RecordBuilder.requestNewExamination()
        .header(h -> h.sender(SENDER).receiver(equipmentSelector).charset(driver.getCharset()))
        .examinationRequest(r -> r.testMethod(driver.getTestMethod()))
        .patient(
            p ->
                p.patientId(correlationId)
                    .lastName(nameAlias.lastName())
                    .firstName(nameAlias.firstName())
                    .dateOfBirth(child.dateOfBirth())
                    .sex(mapGender(child.gender())))
        .build();
  }

  private Gdt21Sex mapGender(GenderDto gender) {
    return switch (gender) {
      case MALE -> Gdt21Sex.MALE;
      case FEMALE, DIVERSE, NOT_SPECIFIED -> Gdt21Sex.FEMALE;
    };
  }
}

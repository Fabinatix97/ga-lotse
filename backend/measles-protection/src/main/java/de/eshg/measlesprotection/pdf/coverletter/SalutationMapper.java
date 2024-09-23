/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.pdf.coverletter;

import de.eshg.base.SalutationDto;
import de.eshg.measlesprotection.api.AffectedPersonDto;
import de.eshg.measlesprotection.api.CustodianDto;
import de.eshg.measlesprotection.api.RoleStatusDto;

final class SalutationMapper {

  private SalutationMapper() {}

  private static String salutation(SalutationDto salutation, String firstName, String lastName) {
    return switch (salutation) {
      case FEMALE -> "Sehr geehrte Frau " + lastName;
      case MALE -> "Sehr geehrter Herr " + lastName;
      default -> "Guten Tag " + firstName + " " + lastName;
    };
  }

  static String salutation(AffectedPersonDto person) {
    RoleStatusDto roleStatusDto = person.roleStatus();
    if (roleStatusDto == RoleStatusDto.SUPERVISED && !person.isAdult()) {
      return "Sehr geehrte Personsorgeberechtigten";
    } else {
      return salutation(person.salutation(), person.firstName(), person.lastName());
    }
  }

  static String salutation(CustodianDto custodian) {
    return salutation(custodian.salutation(), custodian.firstName(), custodian.lastName());
  }
}

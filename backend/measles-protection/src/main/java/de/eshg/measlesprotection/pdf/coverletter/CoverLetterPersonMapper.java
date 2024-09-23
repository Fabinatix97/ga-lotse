/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.pdf.coverletter;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.measlesprotection.api.AffectedPersonDto;
import de.eshg.measlesprotection.api.CustodianDto;
import de.eshg.measlesprotection.api.RoleStatusDto;

public final class CoverLetterPersonMapper {

  private CoverLetterPersonMapper() {}

  public static CoverLetterPerson createAddressee(AffectedPersonDto person) {
    String custodianClause = null;
    if (person.roleStatus() == RoleStatusDto.SUPERVISED && !person.isAdult()) {
      custodianClause = "An die Personsorgeberechtigten von";
    }
    return new CoverLetterPerson(
        SalutationMapper.salutation(person),
        person.firstName(),
        person.lastName(),
        street(person.address()),
        person.address().postalCode(),
        person.address().city(),
        custodianClause);
  }

  private static String street(AddressDto address) {
    if (address instanceof DomesticAddressDto da) {
      return da.street() + " " + da.houseNumber();
    } else {
      return "";
    }
  }

  public static CoverLetterPerson createAddressee(CustodianDto custodian) {
    return new CoverLetterPerson(
        SalutationMapper.salutation(custodian),
        custodian.firstName(),
        custodian.lastName(),
        street(custodian.address()),
        custodian.address().postalCode(),
        custodian.address().city());
  }

  public static CoverLetterPerson createAffectedPerson(AffectedPersonDto person) {
    AddressDto address = person.address();
    return new CoverLetterPerson(
        SalutationMapper.salutation(person),
        person.firstName(),
        person.lastName(),
        street(address),
        address.postalCode(),
        address.city());
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.mapper;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.contact.api.InstitutionContactDto;
import de.eshg.dental.api.InstitutionDto;
import de.eshg.dental.api.InstitutionWithAddressDto;
import org.springframework.util.Assert;

public class InstitutionMapper {

  private InstitutionMapper() {}

  public static InstitutionDto mapContactToInstitutionDto(ContactDto contact) {

    Assert.isInstanceOf(
        InstitutionContactDto.class, contact, "Cannot map person contact to institution!");
    InstitutionContactDto institutionContact = (InstitutionContactDto) contact;
    return new InstitutionDto(
        institutionContact.id(), institutionContact.name(), institutionContact.category());
  }

  public static InstitutionWithAddressDto mapToInstitutionWithAddressDto(
      InstitutionContactDto institution) {
    AddressDto contactAddress = institution.contactAddress();
    if (contactAddress instanceof DomesticAddressDto address) {
      return new InstitutionWithAddressDto(
          institution.id(),
          institution.name(),
          address.city(),
          address.street(),
          address.houseNumber());
    } else {
      throw new IllegalArgumentException("Unexpected instance of Address");
    }
  }
}

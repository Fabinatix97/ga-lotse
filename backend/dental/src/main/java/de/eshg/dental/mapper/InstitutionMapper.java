/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.mapper;

import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.contact.api.InstitutionContactCategoryDto;
import de.eshg.base.contact.api.InstitutionContactDto;
import de.eshg.dental.api.InstitutionDto;

public class InstitutionMapper {
  private static final String HEX_COLOR_SCHOOL = "#3c7eca";
  private static final String HEX_COLOR_DAYCARE = "#d43f49";

  private InstitutionMapper() {}

  public static InstitutionDto mapContactToInstitutionDto(ContactDto contact) {
    return new InstitutionDto(
        contact.id(), contact.name(), mapInstitutionContactToHexColor(contact));
  }

  private static String mapInstitutionContactToHexColor(ContactDto contact) {
    if (!(contact instanceof InstitutionContactDto institutionContactDto)) {
      throw new IllegalArgumentException("Contact must be an instance of InstitutionContactDto");
    }

    return switch (institutionContactDto.category()) {
      case InstitutionContactCategoryDto.SCHOOL -> HEX_COLOR_SCHOOL;
      case InstitutionContactCategoryDto.DAYCARE -> HEX_COLOR_DAYCARE;
      default ->
          throw new IllegalStateException(
              "Unexpected value for institution category: " + institutionContactDto.category());
    };
  }
}

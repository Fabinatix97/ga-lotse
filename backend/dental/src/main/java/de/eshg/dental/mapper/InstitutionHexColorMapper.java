/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.mapper;

import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.contact.api.InstitutionContactCategoryDto;
import de.eshg.base.contact.api.InstitutionContactDto;

public class InstitutionHexColorMapper {
  private static final String HEX_COLOR_SCHOOL = "#3c7eca";
  private static final String HEX_COLOR_DAYCARE = "#d43f49";

  private InstitutionHexColorMapper() {}

  public static String mapInstitutionContactToHexColor(ContactDto contact) {
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

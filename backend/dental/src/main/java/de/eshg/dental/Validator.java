/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import de.eshg.base.contact.api.InstitutionContactCategoryDto;
import de.eshg.lib.contact.ContactClient;
import de.eshg.rest.service.error.BadRequestException;
import java.time.Clock;
import java.time.Year;
import java.util.EnumSet;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class Validator {

  private final Clock clock;
  private final ContactClient contactClient;

  public Validator(Clock clock, ContactClient contactClient) {
    this.clock = clock;
    this.contactClient = contactClient;
  }

  public void validateSchoolYear(int schoolYear) {
    Year requestedYear = Year.of(schoolYear);
    Year currentYear = Year.now(clock);
    if (!requestedYear.equals(currentYear) && !requestedYear.equals(currentYear.minusYears(1))) {
      throw new BadRequestException("Illegal school year: " + schoolYear);
    }
  }

  public void validateInstitution(UUID institutionId) {
    contactClient.validateContactIsInstitutionWithCategory(
        institutionId,
        EnumSet.of(InstitutionContactCategoryDto.SCHOOL, InstitutionContactCategoryDto.DAYCARE));
  }
}

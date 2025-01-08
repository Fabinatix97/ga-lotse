/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import de.eshg.base.contact.api.InstitutionContactCategoryDto;
import de.eshg.dental.domain.repository.ChildRepository;
import de.eshg.lib.contact.ContactClient;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
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
  private final ChildRepository childRepository;

  public Validator(Clock clock, ContactClient contactClient, ChildRepository childRepository) {
    this.clock = clock;
    this.contactClient = contactClient;
    this.childRepository = childRepository;
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

  public void validateGroupAtInstitutionExists(UUID institutionId, String groupName) {
    if (!childRepository.existsByInstitutionIdAndGroupNameAndProcedureStatus(
        institutionId, groupName, ProcedureStatus.OPEN)) {
      throw new BadRequestException("Group does not exist: " + groupName);
    }
  }
}

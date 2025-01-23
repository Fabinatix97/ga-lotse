/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import static de.eshg.lib.procedure.util.ProcedureValidator.hasNonNullValue;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.contact.api.InstitutionContactCategoryDto;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.UserDto;
import de.eshg.dental.api.ChildFilterParameters;
import de.eshg.dental.api.FluoridationConsentDto;
import de.eshg.dental.domain.repository.ChildRepository;
import de.eshg.lib.contact.ContactClient;
import de.eshg.lib.keycloak.TechnicalGroup;
import de.eshg.lib.procedure.api.ProcedureSearchParameters;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.rest.service.error.BadRequestException;
import java.time.Clock;
import java.time.Year;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class Validator {

  private final Clock clock;
  private final ContactClient contactClient;
  private final ChildRepository childRepository;
  private final UserApi userApi;

  public Validator(
      Clock clock, ContactClient contactClient, ChildRepository childRepository, UserApi userApi) {
    this.clock = clock;
    this.contactClient = contactClient;
    this.childRepository = childRepository;
    this.userApi = userApi;
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

  static void validateOnlyOneOfSearchAndFilterParametersAreSet(
      ChildFilterParameters filterParameters, ProcedureSearchParameters searchParameters) {
    if (hasNonNullValue(filterParameters) && hasNonNullValue(searchParameters)) {
      throw new BadRequestException(
          "Filter parameters and search parameters can not be used in the same request.");
    }
  }

  void validateAtLeastOne(List<UUID> ids, String message) {
    if (ids == null || ids.isEmpty()) {
      throw new BadRequestException(message);
    }
  }

  void validateTechnicalGroups(List<UUID> dentistIds, List<UUID> zfaIds) {
    if (dentistIds != null && !dentistIds.isEmpty()) {
      validateTechnicalGroup(dentistIds, TechnicalGroup.DENTIST);
    }
    if (zfaIds != null && !zfaIds.isEmpty()) {
      validateTechnicalGroup(zfaIds, TechnicalGroup.ZFA);
    }
  }

  private void validateTechnicalGroup(List<UUID> userIds, TechnicalGroup group) {
    Set<UUID> groupUserIds =
        userApi.getUsersByGroup(group.getKeycloakName()).users().stream()
            .map(UserDto::userId)
            .collect(StreamUtil.toLinkedHashSet());
    if (!groupUserIds.containsAll(userIds)) {
      throw new BadRequestException(
          String.format(
              "Not all userIds belong to the correct technical group (%s).",
              group.getKeycloakName()));
    }
  }

  public void validateFluoridationConsent(FluoridationConsentDto fluoridationConsent) {
    if (fluoridationConsent != null
        && fluoridationConsent.consented()
        && Boolean.TRUE.equals(fluoridationConsent.hasAllergy())) {
      throw new BadRequestException("Child cannot have an allergy and fluoridation consent.");
    }
  }
}

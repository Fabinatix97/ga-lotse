/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.mapper;

import de.eshg.dental.api.ChildDetailsDto;
import de.eshg.dental.api.ChildDto;
import de.eshg.dental.api.CreateChildRequest;
import de.eshg.dental.api.ExaminationDto;
import de.eshg.dental.api.InstitutionDto;
import de.eshg.dental.business.model.ChildWithAugmentedData;
import de.eshg.dental.business.model.ImportChildData;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Examination;
import java.time.Year;
import java.util.List;
import java.util.UUID;

public final class ChildMapper {
  private ChildMapper() {}

  public static void mapToChild(CreateChildRequest request, Child child) {
    child.setYear(Year.of(request.year()));
    child.setGroupName(request.groupName());
    child.setInstitutionId(request.institutionId());
  }

  public static ChildDetailsDto mapToChildDetailsDto(ChildWithAugmentedData child) {
    if (child == null) return null;
    return new ChildDetailsDto(
        child.child().getExternalId(),
        child.personData().referenceVersion(),
        child.personData().id(),
        child.personData().outdated(),
        child.personData().title(),
        child.personData().salutation(),
        child.personData().gender(),
        child.personData().firstName(),
        child.personData().lastName(),
        child.personData().dateOfBirth(),
        child.personData().nameAtBirth(),
        child.personData().placeOfBirth(),
        child.personData().countryOfBirth(),
        child.personData().emailAddresses(),
        child.personData().phoneNumbers(),
        child.personData().contactAddress(),
        child.personData().differentBillingAddress(),
        child.child().getYear().getValue(),
        child.child().getGroupName(),
        new InstitutionDto(child.contact().id(), child.contact().name()),
        mapToDto(child.child().getExaminations()));
  }

  public static ChildDto mapChildToDto(ChildWithAugmentedData child) {
    return new ChildDto(
        child.child().getExternalId(),
        child.personData().firstName(),
        child.personData().lastName(),
        child.personData().gender(),
        child.personData().dateOfBirth(),
        child.child().getYear().getValue(),
        child.child().getGroupName(),
        new InstitutionDto(child.contact().id(), child.contact().name()));
  }

  private static List<ExaminationDto> mapToDto(List<Examination> examinations) {
    if (examinations == null) return List.of();
    return examinations.stream()
        .map(
            examination ->
                new ExaminationDto(
                    examination.getExternalId(), examination.getVersion(),
                    examination.getProphylaxisSession().getDateAndTime(), examination.getNote()))
        .toList();
  }

  public static CreateChildRequest mapImportDataToCreateChildRequest(
      ImportChildData importChildData, UUID institutionId, int schoolYear) {
    return new CreateChildRequest(
        importChildData.firstName(),
        importChildData.lastName(),
        importChildData.gender(),
        importChildData.dateOfBirth(),
        schoolYear,
        importChildData.groupName(),
        institutionId);
  }
}

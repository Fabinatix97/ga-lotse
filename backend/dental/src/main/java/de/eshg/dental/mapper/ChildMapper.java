/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.mapper;

import de.eshg.dental.api.AnnualInstitutionDto;
import de.eshg.dental.api.ChildDetailsDto;
import de.eshg.dental.api.ChildDto;
import de.eshg.dental.api.CreateChildRequest;
import de.eshg.dental.api.ExaminationDto;
import de.eshg.dental.api.FluoridationConsentDto;
import de.eshg.dental.business.model.ChildWithAugmentedData;
import de.eshg.dental.business.model.ImportChildData;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.model.FluoridationConsent;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
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

  public static ChildDetailsDto mapToChildDetailsDto(
      ChildWithAugmentedData child,
      List<Examination> examinations,
      List<FluoridationConsent> fluoridationConsents,
      List<AnnualInstitutionDto> institutions) {
    if (child == null) {
      return null;
    }

    return new ChildDetailsDto(
        child.child().getExternalId(),
        child.child().getVersion(),
        ProcedureMapper.toInterfaceType(child.child().getProcedureStatus()),
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
        mapExaminationsToDto(examinations),
        institutions == null ? List.of() : institutions,
        mapFluoridationToDto(fluoridationConsents));
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
        InstitutionMapper.mapContactToInstitutionDto(child.contact()),
        ProcedureMapper.toInterfaceType(child.child().getProcedureStatus()));
  }

  private static List<ExaminationDto> mapExaminationsToDto(List<Examination> examinations) {
    if (examinations == null) {
      return List.of();
    }
    return examinations.stream().map(ExaminationMapper::mapToDto).toList();
  }

  public static List<FluoridationConsentDto> mapFluoridationToDto(
      List<FluoridationConsent> fluoridationConsent) {
    if (fluoridationConsent == null) {
      return List.of();
    }
    return fluoridationConsent.stream()
        .map(f -> new FluoridationConsentDto(f.getDateOfConsent(), f.isConsented(), f.hasAllergy()))
        .toList();
  }

  public static FluoridationConsent mapFluoridationToDomain(FluoridationConsentDto dto) {
    if (dto == null) {
      return null;
    }

    FluoridationConsent fluoridationConsent = new FluoridationConsent();
    fluoridationConsent.setDateOfConsent(dto.dateOfConsent());
    fluoridationConsent.setConsented(dto.consented());
    fluoridationConsent.setHasAllergy(dto.hasAllergy());
    return fluoridationConsent;
  }

  public static CreateChildRequest mapImportDataToCreateChildRequest(
      ImportChildData importChildData, UUID institutionId, Year year) {
    return new CreateChildRequest(
        importChildData.firstName(),
        importChildData.lastName(),
        importChildData.gender(),
        importChildData.dateOfBirth(),
        year,
        importChildData.groupName(),
        institutionId);
  }
}

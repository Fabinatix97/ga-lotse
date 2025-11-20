/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.mapper;

import static de.eshg.dental.mapper.BooleanWithUnknownMapper.mapToDomain;
import static de.eshg.dental.mapper.BooleanWithUnknownMapper.mapToDto;

import de.eshg.base.centralfile.api.person.PersonDetailsDto;
import de.eshg.dental.api.AnnualInstitutionDto;
import de.eshg.dental.api.ChildDetailsDto;
import de.eshg.dental.api.ChildDto;
import de.eshg.dental.api.CreateChildRequest;
import de.eshg.dental.api.ExaminationDto;
import de.eshg.dental.api.FluoridationConsentDto;
import de.eshg.dental.api.UpdatePersonRequest;
import de.eshg.dental.business.model.ChildWithPersonAndContactData;
import de.eshg.dental.business.model.ImportChildData;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.model.FluoridationConsent;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.lib.xlsximport.util.AddressMapper;
import java.time.Year;
import java.util.List;
import java.util.UUID;

public final class ChildMapper {
  private ChildMapper() {}

  public static void mapToChild(CreateChildRequest request, Child child) {
    child.setYear(Year.of(request.year()));
    if (request.groupName() != null) {
      child.setGroupName(request.groupName().trim());
    } else {
      child.setGroupName(null);
    }
    child.setInstitutionId(request.institutionId());
  }

  public static ChildDetailsDto mapToChildDetailsDto(
      ChildWithPersonAndContactData augmentedChild,
      List<Examination> examinations,
      List<FluoridationConsent> fluoridationConsents,
      List<AnnualInstitutionDto> institutions) {
    if (augmentedChild == null) {
      return null;
    }

    return new ChildDetailsDto(
        augmentedChild.child().getExternalId(),
        augmentedChild.child().getVersion(),
        augmentedChild.child().getChild().getVersion(),
        ProcedureMapper.toInterfaceType(augmentedChild.child().getProcedureStatus()),
        augmentedChild.person().id(),
        augmentedChild.person().outdated(),
        augmentedChild.person().title(),
        augmentedChild.person().salutation(),
        augmentedChild.person().gender(),
        augmentedChild.person().firstName(),
        augmentedChild.person().lastName(),
        augmentedChild.person().dateOfBirth(),
        augmentedChild.person().nameAtBirth(),
        augmentedChild.person().placeOfBirth(),
        augmentedChild.person().countryOfBirth(),
        augmentedChild.person().emailAddresses(),
        augmentedChild.person().phoneNumbers(),
        augmentedChild.person().contactAddress(),
        augmentedChild.person().differentBillingAddress(),
        augmentedChild.child().getYear().getValue(),
        augmentedChild.child().getGroupName() != null
                && !augmentedChild.child().getGroupName().isBlank()
            ? augmentedChild.child().getGroupName().trim()
            : null,
        ProcedureLabelMapper.toDto(augmentedChild.child().getProcedureLabels()),
        mapExaminationsToDto(examinations),
        institutions == null ? List.of() : institutions,
        mapFluoridationToDto(fluoridationConsents),
        augmentedChild.child().getNote());
  }

  public static ChildDto mapChildToDto(ChildWithPersonAndContactData child) {
    return new ChildDto(
        child.child().getExternalId(),
        child.person().firstName(),
        child.person().lastName(),
        child.person().gender(),
        child.person().dateOfBirth(),
        child.child().getYear().getValue(),
        child.child().getGroupName(),
        InstitutionMapper.mapContactToInstitutionDto(child.contact()),
        ProcedureMapper.toInterfaceType(child.child().getProcedureStatus()),
        ProcedureLabelMapper.toDto(child.child().getProcedureLabels()),
        mapToDto(child.child().getCurrentFluoridationConsent()));
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
        .map(
            f ->
                new FluoridationConsentDto(
                    f.getDateOfConsent(), mapToDto(f.getConsented()), f.hasAllergy()))
        .toList();
  }

  public static FluoridationConsent mapFluoridationToDomain(FluoridationConsentDto dto) {
    if (dto == null) {
      return null;
    }

    FluoridationConsent fluoridationConsent = new FluoridationConsent();
    fluoridationConsent.setDateOfConsent(dto.dateOfConsent());
    fluoridationConsent.setConsented(mapToDomain(dto.consented()));
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
        AddressMapper.mapToDto(importChildData.address()),
        year,
        importChildData.groupName(),
        institutionId);
  }

  public static PersonDetailsDto mapToPersonDetailsDto(UpdatePersonRequest child) {
    return new PersonDetailsDto(
        child.title(),
        child.salutation(),
        child.gender(),
        child.firstName(),
        child.lastName(),
        child.dateOfBirth(),
        child.nameAtBirth(),
        child.placeOfBirth(),
        child.countryOfBirth(),
        child.emailAddresses(),
        child.phoneNumbers(),
        child.contactAddress(),
        child.differentBillingAddress());
  }
}

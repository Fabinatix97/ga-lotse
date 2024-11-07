/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.mapper;

import static de.eshg.medicalregistry.mapper.AddressMapper.*;
import static de.eshg.medicalregistry.util.MapperUtils.singleElementOrNull;

import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.medicalregistry.api.*;
import de.eshg.medicalregistry.domain.model.EmploymentStatus;
import de.eshg.medicalregistry.domain.model.EmploymentType;
import de.eshg.medicalregistry.domain.model.Professional;
import de.eshg.medicalregistry.domain.model.ProfessionalTitle;

public final class ProfessionalMapper {
  private ProfessionalMapper() {}

  public static ProfessionalDto mapToDto(
      Professional professional, GetPersonFileStateResponse professionalDetails) {
    if (professionalDetails == null) {
      return null;
    }

    return new ProfessionalDto(
        professionalDetails.title(),
        professionalDetails.gender(),
        professionalDetails.firstName(),
        professionalDetails.lastName(),
        professionalDetails.dateOfBirth(),
        professionalDetails.nameAtBirth(),
        professionalDetails.placeOfBirth(),
        singleElementOrNull(professionalDetails.emailAddresses()),
        singleElementOrNull(professionalDetails.phoneNumbers()),
        mapToProfessionalAddressDto(professionalDetails.contactAddress()),
        mapToDto(professional.getProfessionalTitle()),
        professional.getFieldOfExpertise(),
        professional.getSpecialistTitle(),
        professional.getFurtherTraining(),
        professional.getQualifications(),
        professional.getApprobationGrantedOn(),
        professional.getApprobationIssuingAuthority(),
        professional.getLifetimeDoctorNumber(),
        mapToDto(professional.getEmploymentType()),
        mapToDto(professional.getEmploymentStatus()),
        professional.getNationality());
  }

  private static ProfessionalTitleDto mapToDto(ProfessionalTitle professionalTitle) {
    if (professionalTitle == null) {
      return null;
    }

    return switch (professionalTitle) {
      case DOCTORS -> ProfessionalTitleDto.DOCTORS;
      case DENTISTS -> ProfessionalTitleDto.DENTISTS;
      case PSYCHOLOGICAL_PSYCHOTHERAPISTS -> ProfessionalTitleDto.PSYCHOLOGICAL_PSYCHOTHERAPISTS;
      case NURSING_ASSISTANTS -> ProfessionalTitleDto.NURSING_ASSISTANTS;
      case GERIATRIC_NURSES -> ProfessionalTitleDto.GERIATRIC_NURSES;
      case DIETICIANS -> ProfessionalTitleDto.DIETICIANS;
      case DISINFECTORS -> ProfessionalTitleDto.DISINFECTORS;
      case OCCUPATIONAL_THERAPISTS -> ProfessionalTitleDto.OCCUPATIONAL_THERAPISTS;
      case HEALTH_SUPERVISORS -> ProfessionalTitleDto.HEALTH_SUPERVISORS;
      case HEALTHCARE_AND_PEDIATRIC_NURSES -> ProfessionalTitleDto.HEALTHCARE_AND_PEDIATRIC_NURSES;
      case HEALTHCARE_AND_NURSING_ASSISTANTS ->
          ProfessionalTitleDto.HEALTHCARE_AND_NURSING_ASSISTANTS;
      case HEALTHCARE_AND_NURSING_ASSISTANTS_HELPER ->
          ProfessionalTitleDto.HEALTHCARE_AND_NURSING_ASSISTANTS_HELPER;
      case MIDWIVES_MATERNITY_NURSES -> ProfessionalTitleDto.MIDWIVES_MATERNITY_NURSES;
      case ALTERNATIVE_PRACTITIONERS -> ProfessionalTitleDto.ALTERNATIVE_PRACTITIONERS;
      case NON_MEDICAL_PRACTITIONER_FOR_CHIROPRACTIC ->
          ProfessionalTitleDto.NON_MEDICAL_PRACTITIONER_FOR_CHIROPRACTIC;
      case ALTERNATIVE_PRACTITIONER_FOR_SPEECH_THERAPY ->
          ProfessionalTitleDto.ALTERNATIVE_PRACTITIONER_FOR_SPEECH_THERAPY;
      case NON_MEDICAL_PRACTITIONER_FOR_PHYSIOTHERAPY ->
          ProfessionalTitleDto.NON_MEDICAL_PRACTITIONER_FOR_PHYSIOTHERAPY;
      case NON_MEDICAL_PRACTITIONERS_FOR_PSYCHOTHERAPY ->
          ProfessionalTitleDto.NON_MEDICAL_PRACTITIONERS_FOR_PSYCHOTHERAPY;
      case CHILD_AND_YOUTH_PSYCHOTHERAPISTS ->
          ProfessionalTitleDto.CHILD_AND_YOUTH_PSYCHOTHERAPISTS;
      case SPEECH_THERAPISTS -> ProfessionalTitleDto.SPEECH_THERAPISTS;
      case MASSEURS_AND_MEDICAL_BATH_ATTENDANTS ->
          ProfessionalTitleDto.MASSEURS_AND_MEDICAL_BATH_ATTENDANTS;
      case MEDICAL_DOCUMENTALISTS -> ProfessionalTitleDto.MEDICAL_DOCUMENTALISTS;
      case MEDICAL_TECHNICAL_LABORATORY_ASSISTANTS ->
          ProfessionalTitleDto.MEDICAL_TECHNICAL_LABORATORY_ASSISTANTS;
      case MEDICAL_TECHNICAL_RADIOLOGY_ASSISTANTS ->
          ProfessionalTitleDto.MEDICAL_TECHNICAL_RADIOLOGY_ASSISTANTS;
      case MEDICAL_TECHNICAL_ASSISTANTS_FOR_FUNCTIONAL_DIAGNOSTICS ->
          ProfessionalTitleDto.MEDICAL_TECHNICAL_ASSISTANTS_FOR_FUNCTIONAL_DIAGNOSTICS;
      case EMERGENCY_PARAMEDICS -> ProfessionalTitleDto.EMERGENCY_PARAMEDICS;
      case ORTHOPTISTS -> ProfessionalTitleDto.ORTHOPTISTS;
      case CARE_ASSISTANTS -> ProfessionalTitleDto.CARE_ASSISTANTS;
      case NURSING_SERVICES -> ProfessionalTitleDto.NURSING_SERVICES;
      case NURSING_SERVICE_MANAGERS -> ProfessionalTitleDto.NURSING_SERVICE_MANAGERS;
      case PHARMACEUTICAL_TECHNICAL_ASSISTANTS ->
          ProfessionalTitleDto.PHARMACEUTICAL_TECHNICAL_ASSISTANTS;
      case PHYSIOTHERAPISTS -> ProfessionalTitleDto.PHYSIOTHERAPISTS;
      case PODIATRISTS -> ProfessionalTitleDto.PODIATRISTS;
      case RADIOLOGY_ASSISTANTS -> ProfessionalTitleDto.RADIOLOGY_ASSISTANTS;
      case SPORTS_THERAPISTS -> ProfessionalTitleDto.SPORTS_THERAPISTS;
      case PHARMACISTS -> ProfessionalTitleDto.PHARMACISTS;
      case VETERINARIANS -> ProfessionalTitleDto.VETERINARIANS;
    };
  }

  private static EmploymentTypeDto mapToDto(EmploymentType employmentType) {
    if (employmentType == null) {
      return null;
    }

    return switch (employmentType) {
      case FULL_TIME -> EmploymentTypeDto.FULL_TIME;
      case PART_TIME -> EmploymentTypeDto.PART_TIME;
    };
  }

  private static EmploymentStatusDto mapToDto(EmploymentStatus employmentStatus) {
    if (employmentStatus == null) {
      return null;
    }

    return switch (employmentStatus) {
      case SELF_EMPLOYED -> EmploymentStatusDto.SELF_EMPLOYED;
      case FREELANCE -> EmploymentStatusDto.FREELANCE;
      case EMPLOYEE -> EmploymentStatusDto.EMPLOYEE;
    };
  }

  public static ProfessionalTitle mapToDomain(ProfessionalTitleDto professionalTitleDto) {
    if (professionalTitleDto == null) {
      return null;
    }

    return switch (professionalTitleDto) {
      case DOCTORS -> ProfessionalTitle.DOCTORS;
      case DENTISTS -> ProfessionalTitle.DENTISTS;
      case PSYCHOLOGICAL_PSYCHOTHERAPISTS -> ProfessionalTitle.PSYCHOLOGICAL_PSYCHOTHERAPISTS;
      case NURSING_ASSISTANTS -> ProfessionalTitle.NURSING_ASSISTANTS;
      case GERIATRIC_NURSES -> ProfessionalTitle.GERIATRIC_NURSES;
      case DIETICIANS -> ProfessionalTitle.DIETICIANS;
      case DISINFECTORS -> ProfessionalTitle.DISINFECTORS;
      case OCCUPATIONAL_THERAPISTS -> ProfessionalTitle.OCCUPATIONAL_THERAPISTS;
      case HEALTH_SUPERVISORS -> ProfessionalTitle.HEALTH_SUPERVISORS;
      case HEALTHCARE_AND_PEDIATRIC_NURSES -> ProfessionalTitle.HEALTHCARE_AND_PEDIATRIC_NURSES;
      case HEALTHCARE_AND_NURSING_ASSISTANTS -> ProfessionalTitle.HEALTHCARE_AND_NURSING_ASSISTANTS;
      case HEALTHCARE_AND_NURSING_ASSISTANTS_HELPER ->
          ProfessionalTitle.HEALTHCARE_AND_NURSING_ASSISTANTS_HELPER;
      case MIDWIVES_MATERNITY_NURSES -> ProfessionalTitle.MIDWIVES_MATERNITY_NURSES;
      case ALTERNATIVE_PRACTITIONERS -> ProfessionalTitle.ALTERNATIVE_PRACTITIONERS;
      case NON_MEDICAL_PRACTITIONER_FOR_CHIROPRACTIC ->
          ProfessionalTitle.NON_MEDICAL_PRACTITIONER_FOR_CHIROPRACTIC;
      case ALTERNATIVE_PRACTITIONER_FOR_SPEECH_THERAPY ->
          ProfessionalTitle.ALTERNATIVE_PRACTITIONER_FOR_SPEECH_THERAPY;
      case NON_MEDICAL_PRACTITIONER_FOR_PHYSIOTHERAPY ->
          ProfessionalTitle.NON_MEDICAL_PRACTITIONER_FOR_PHYSIOTHERAPY;
      case NON_MEDICAL_PRACTITIONERS_FOR_PSYCHOTHERAPY ->
          ProfessionalTitle.NON_MEDICAL_PRACTITIONERS_FOR_PSYCHOTHERAPY;
      case CHILD_AND_YOUTH_PSYCHOTHERAPISTS -> ProfessionalTitle.CHILD_AND_YOUTH_PSYCHOTHERAPISTS;
      case SPEECH_THERAPISTS -> ProfessionalTitle.SPEECH_THERAPISTS;
      case MASSEURS_AND_MEDICAL_BATH_ATTENDANTS ->
          ProfessionalTitle.MASSEURS_AND_MEDICAL_BATH_ATTENDANTS;
      case MEDICAL_DOCUMENTALISTS -> ProfessionalTitle.MEDICAL_DOCUMENTALISTS;
      case MEDICAL_TECHNICAL_LABORATORY_ASSISTANTS ->
          ProfessionalTitle.MEDICAL_TECHNICAL_LABORATORY_ASSISTANTS;
      case MEDICAL_TECHNICAL_RADIOLOGY_ASSISTANTS ->
          ProfessionalTitle.MEDICAL_TECHNICAL_RADIOLOGY_ASSISTANTS;
      case MEDICAL_TECHNICAL_ASSISTANTS_FOR_FUNCTIONAL_DIAGNOSTICS ->
          ProfessionalTitle.MEDICAL_TECHNICAL_ASSISTANTS_FOR_FUNCTIONAL_DIAGNOSTICS;
      case EMERGENCY_PARAMEDICS -> ProfessionalTitle.EMERGENCY_PARAMEDICS;
      case ORTHOPTISTS -> ProfessionalTitle.ORTHOPTISTS;
      case CARE_ASSISTANTS -> ProfessionalTitle.CARE_ASSISTANTS;
      case NURSING_SERVICES -> ProfessionalTitle.NURSING_SERVICES;
      case NURSING_SERVICE_MANAGERS -> ProfessionalTitle.NURSING_SERVICE_MANAGERS;
      case PHARMACEUTICAL_TECHNICAL_ASSISTANTS ->
          ProfessionalTitle.PHARMACEUTICAL_TECHNICAL_ASSISTANTS;
      case PHYSIOTHERAPISTS -> ProfessionalTitle.PHYSIOTHERAPISTS;
      case PODIATRISTS -> ProfessionalTitle.PODIATRISTS;
      case RADIOLOGY_ASSISTANTS -> ProfessionalTitle.RADIOLOGY_ASSISTANTS;
      case SPORTS_THERAPISTS -> ProfessionalTitle.SPORTS_THERAPISTS;
      case PHARMACISTS -> ProfessionalTitle.PHARMACISTS;
      case VETERINARIANS -> ProfessionalTitle.VETERINARIANS;
    };
  }

  public static EmploymentType mapToDomain(EmploymentTypeDto employmentTypeDto) {
    if (employmentTypeDto == null) {
      return null;
    }

    return switch (employmentTypeDto) {
      case FULL_TIME -> EmploymentType.FULL_TIME;
      case PART_TIME -> EmploymentType.PART_TIME;
    };
  }

  public static EmploymentStatus mapToDomain(EmploymentStatusDto employmentStatusDto) {
    if (employmentStatusDto == null) {
      return null;
    }

    return switch (employmentStatusDto) {
      case SELF_EMPLOYED -> EmploymentStatus.SELF_EMPLOYED;
      case FREELANCE -> EmploymentStatus.FREELANCE;
      case EMPLOYEE -> EmploymentStatus.EMPLOYEE;
    };
  }

  public static ProfessionalAddressDto mapToDto(de.eshg.base.address.AddressDto addressDto) {
    if (addressDto == null) {
      return null;
    }

    if (addressDto instanceof DomesticAddressDto address) {
      return mapToDto(address);
    } else {
      throw new IllegalArgumentException("Unexpected instance of Address");
    }
  }

  private static ProfessionalAddressDto mapToDto(DomesticAddressDto addressDto) {
    if (addressDto == null) {
      return null;
    }

    return new ProfessionalAddressDto(
        addressDto.country(),
        addressDto.street(),
        addressDto.houseNumber(),
        addressDto.postalCode(),
        addressDto.city());
  }
}

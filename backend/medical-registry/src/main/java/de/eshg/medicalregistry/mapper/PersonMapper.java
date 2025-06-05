/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.mapper;

import static de.eshg.medicalregistry.mapper.AddressMapper.mapToApplicantAddressDto;

import de.eshg.base.centralfile.api.person.PersonDetails;
import de.eshg.medicalregistry.api.ApplicantDto;
import de.eshg.medicalregistry.api.EmployeeChangeDto;
import de.eshg.medicalregistry.api.EmployeeChangeTypeDto;
import de.eshg.medicalregistry.api.EmployeeDto;
import de.eshg.medicalregistry.api.EmploymentStatusDto;
import de.eshg.medicalregistry.api.EmploymentTypeDto;
import de.eshg.medicalregistry.api.ProfessionInformationDto;
import de.eshg.medicalregistry.api.ProfessionalTitleDto;
import de.eshg.medicalregistry.domain.model.Employee;
import de.eshg.medicalregistry.domain.model.EmployeeChange;
import de.eshg.medicalregistry.domain.model.EmployeeChangeType;
import de.eshg.medicalregistry.domain.model.EmploymentStatus;
import de.eshg.medicalregistry.domain.model.EmploymentType;
import de.eshg.medicalregistry.domain.model.ProfessionInformation;
import de.eshg.medicalregistry.domain.model.Professional;
import de.eshg.medicalregistry.domain.model.ProfessionalTitle;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public final class PersonMapper {
  private PersonMapper() {}

  public static ApplicantDto mapToDto(
      Professional professional, Map<UUID, PersonDetails> personDetails) {
    PersonDetails applicantDetails = personDetails.get(professional.getCentralFileStateId());
    if (applicantDetails == null) {
      return null;
    }

    return new ApplicantDto(
        applicantDetails.title(),
        applicantDetails.gender(),
        applicantDetails.firstName(),
        applicantDetails.lastName(),
        applicantDetails.dateOfBirth(),
        applicantDetails.nameAtBirth(),
        applicantDetails.placeOfBirth(),
        applicantDetails.emailAddresses(),
        applicantDetails.phoneNumbers(),
        mapToApplicantAddressDto(applicantDetails.contactAddress()),
        professional.getNationality());
  }

  public static ProfessionInformationDto mapToDto(ProfessionInformation professionInformation) {
    return new ProfessionInformationDto(
        mapToDto(professionInformation.getProfessionalTitle()),
        professionInformation.getFieldOfExpertise(),
        professionInformation.getSpecialistTitle(),
        professionInformation.getFurtherTraining(),
        professionInformation.getQualifications(),
        professionInformation.getApprobationGrantedOn(),
        professionInformation.getApprobationIssuingAuthority(),
        professionInformation.getLifetimeDoctorNumber(),
        mapToDto(professionInformation.getEmploymentType()),
        mapToDto(professionInformation.getEmploymentStatus()));
  }

  public static ProfessionalTitleDto mapToDto(ProfessionalTitle professionalTitle) {
    if (professionalTitle == null) {
      return null;
    }

    return switch (professionalTitle) {
      case DOCTOR -> ProfessionalTitleDto.DOCTOR;
      case DENTIST -> ProfessionalTitleDto.DENTIST;
      case PSYCHOLOGICAL_PSYCHOTHERAPIST -> ProfessionalTitleDto.PSYCHOLOGICAL_PSYCHOTHERAPIST;
      case NURSING_ASSISTANT -> ProfessionalTitleDto.NURSING_ASSISTANT;
      case GERIATRIC_NURSE -> ProfessionalTitleDto.GERIATRIC_NURSE;
      case DIETICIAN -> ProfessionalTitleDto.DIETICIAN;
      case DISINFECTOR -> ProfessionalTitleDto.DISINFECTOR;
      case OCCUPATIONAL_THERAPIST -> ProfessionalTitleDto.OCCUPATIONAL_THERAPIST;
      case HEALTH_SUPERVISOR -> ProfessionalTitleDto.HEALTH_SUPERVISOR;
      case HEALTHCARE_AND_PEDIATRIC_NURSE -> ProfessionalTitleDto.HEALTHCARE_AND_PEDIATRIC_NURSE;
      case HEALTHCARE_AND_NURSING_ASSISTANT ->
          ProfessionalTitleDto.HEALTHCARE_AND_NURSING_ASSISTANT;
      case HEALTHCARE_AND_NURSING_ASSISTANTS_HELPER ->
          ProfessionalTitleDto.HEALTHCARE_AND_NURSING_ASSISTANTS_HELPER;
      case MIDWIVE_MATERNITY_NURSE -> ProfessionalTitleDto.MIDWIVE_MATERNITY_NURSE;
      case ALTERNATIVE_PRACTITIONER -> ProfessionalTitleDto.ALTERNATIVE_PRACTITIONER;
      case NON_MEDICAL_PRACTITIONER_FOR_CHIROPRACTIC ->
          ProfessionalTitleDto.NON_MEDICAL_PRACTITIONER_FOR_CHIROPRACTIC;
      case ALTERNATIVE_PRACTITIONER_FOR_SPEECH_THERAPY ->
          ProfessionalTitleDto.ALTERNATIVE_PRACTITIONER_FOR_SPEECH_THERAPY;
      case NON_MEDICAL_PRACTITIONER_FOR_PHYSIOTHERAPY ->
          ProfessionalTitleDto.NON_MEDICAL_PRACTITIONER_FOR_PHYSIOTHERAPY;
      case NON_MEDICAL_PRACTITIONER_FOR_PSYCHOTHERAPY ->
          ProfessionalTitleDto.NON_MEDICAL_PRACTITIONER_FOR_PSYCHOTHERAPY;
      case CHILD_AND_YOUTH_PSYCHOTHERAPIST -> ProfessionalTitleDto.CHILD_AND_YOUTH_PSYCHOTHERAPIST;
      case SPEECH_THERAPIST -> ProfessionalTitleDto.SPEECH_THERAPIST;
      case MASSEUR_AND_MEDICAL_BATH_ATTENDANT ->
          ProfessionalTitleDto.MASSEUR_AND_MEDICAL_BATH_ATTENDANT;
      case MEDICAL_DOCUMENTALIST -> ProfessionalTitleDto.MEDICAL_DOCUMENTALIST;
      case MEDICAL_TECHNICAL_LABORATORY_ASSISTANT ->
          ProfessionalTitleDto.MEDICAL_TECHNICAL_LABORATORY_ASSISTANT;
      case MEDICAL_TECHNICAL_RADIOLOGY_ASSISTANT ->
          ProfessionalTitleDto.MEDICAL_TECHNICAL_RADIOLOGY_ASSISTANT;
      case MEDICAL_TECHNICAL_ASSISTANT_FOR_FUNCTIONAL_DIAGNOSTICS ->
          ProfessionalTitleDto.MEDICAL_TECHNICAL_ASSISTANT_FOR_FUNCTIONAL_DIAGNOSTICS;
      case EMERGENCY_PARAMEDIC -> ProfessionalTitleDto.EMERGENCY_PARAMEDIC;
      case ORTHOPTIST -> ProfessionalTitleDto.ORTHOPTIST;
      case CARE_ASSISTANT -> ProfessionalTitleDto.CARE_ASSISTANT;
      case NURSING_SERVICE -> ProfessionalTitleDto.NURSING_SERVICE;
      case NURSING_SERVICE_MANAGER -> ProfessionalTitleDto.NURSING_SERVICE_MANAGER;
      case PHARMACEUTICAL_TECHNICAL_ASSISTANT ->
          ProfessionalTitleDto.PHARMACEUTICAL_TECHNICAL_ASSISTANT;
      case PHYSIOTHERAPIST -> ProfessionalTitleDto.PHYSIOTHERAPIST;
      case PODIATRIST -> ProfessionalTitleDto.PODIATRIST;
      case RADIOLOGY_ASSISTANT -> ProfessionalTitleDto.RADIOLOGY_ASSISTANT;
      case SPORTS_THERAPIST -> ProfessionalTitleDto.SPORTS_THERAPIST;
      case PHARMACIST -> ProfessionalTitleDto.PHARMACIST;
      case VETERINARIAN -> ProfessionalTitleDto.VETERINARIAN;
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
      case DOCTOR -> ProfessionalTitle.DOCTOR;
      case DENTIST -> ProfessionalTitle.DENTIST;
      case PSYCHOLOGICAL_PSYCHOTHERAPIST -> ProfessionalTitle.PSYCHOLOGICAL_PSYCHOTHERAPIST;
      case NURSING_ASSISTANT -> ProfessionalTitle.NURSING_ASSISTANT;
      case GERIATRIC_NURSE -> ProfessionalTitle.GERIATRIC_NURSE;
      case DIETICIAN -> ProfessionalTitle.DIETICIAN;
      case DISINFECTOR -> ProfessionalTitle.DISINFECTOR;
      case OCCUPATIONAL_THERAPIST -> ProfessionalTitle.OCCUPATIONAL_THERAPIST;
      case HEALTH_SUPERVISOR -> ProfessionalTitle.HEALTH_SUPERVISOR;
      case HEALTHCARE_AND_PEDIATRIC_NURSE -> ProfessionalTitle.HEALTHCARE_AND_PEDIATRIC_NURSE;
      case HEALTHCARE_AND_NURSING_ASSISTANT -> ProfessionalTitle.HEALTHCARE_AND_NURSING_ASSISTANT;
      case HEALTHCARE_AND_NURSING_ASSISTANTS_HELPER ->
          ProfessionalTitle.HEALTHCARE_AND_NURSING_ASSISTANTS_HELPER;
      case MIDWIVE_MATERNITY_NURSE -> ProfessionalTitle.MIDWIVE_MATERNITY_NURSE;
      case ALTERNATIVE_PRACTITIONER -> ProfessionalTitle.ALTERNATIVE_PRACTITIONER;
      case NON_MEDICAL_PRACTITIONER_FOR_CHIROPRACTIC ->
          ProfessionalTitle.NON_MEDICAL_PRACTITIONER_FOR_CHIROPRACTIC;
      case ALTERNATIVE_PRACTITIONER_FOR_SPEECH_THERAPY ->
          ProfessionalTitle.ALTERNATIVE_PRACTITIONER_FOR_SPEECH_THERAPY;
      case NON_MEDICAL_PRACTITIONER_FOR_PHYSIOTHERAPY ->
          ProfessionalTitle.NON_MEDICAL_PRACTITIONER_FOR_PHYSIOTHERAPY;
      case NON_MEDICAL_PRACTITIONER_FOR_PSYCHOTHERAPY ->
          ProfessionalTitle.NON_MEDICAL_PRACTITIONER_FOR_PSYCHOTHERAPY;
      case CHILD_AND_YOUTH_PSYCHOTHERAPIST -> ProfessionalTitle.CHILD_AND_YOUTH_PSYCHOTHERAPIST;
      case SPEECH_THERAPIST -> ProfessionalTitle.SPEECH_THERAPIST;
      case MASSEUR_AND_MEDICAL_BATH_ATTENDANT ->
          ProfessionalTitle.MASSEUR_AND_MEDICAL_BATH_ATTENDANT;
      case MEDICAL_DOCUMENTALIST -> ProfessionalTitle.MEDICAL_DOCUMENTALIST;
      case MEDICAL_TECHNICAL_LABORATORY_ASSISTANT ->
          ProfessionalTitle.MEDICAL_TECHNICAL_LABORATORY_ASSISTANT;
      case MEDICAL_TECHNICAL_RADIOLOGY_ASSISTANT ->
          ProfessionalTitle.MEDICAL_TECHNICAL_RADIOLOGY_ASSISTANT;
      case MEDICAL_TECHNICAL_ASSISTANT_FOR_FUNCTIONAL_DIAGNOSTICS ->
          ProfessionalTitle.MEDICAL_TECHNICAL_ASSISTANT_FOR_FUNCTIONAL_DIAGNOSTICS;
      case EMERGENCY_PARAMEDIC -> ProfessionalTitle.EMERGENCY_PARAMEDIC;
      case ORTHOPTIST -> ProfessionalTitle.ORTHOPTIST;
      case CARE_ASSISTANT -> ProfessionalTitle.CARE_ASSISTANT;
      case NURSING_SERVICE -> ProfessionalTitle.NURSING_SERVICE;
      case NURSING_SERVICE_MANAGER -> ProfessionalTitle.NURSING_SERVICE_MANAGER;
      case PHARMACEUTICAL_TECHNICAL_ASSISTANT ->
          ProfessionalTitle.PHARMACEUTICAL_TECHNICAL_ASSISTANT;
      case PHYSIOTHERAPIST -> ProfessionalTitle.PHYSIOTHERAPIST;
      case PODIATRIST -> ProfessionalTitle.PODIATRIST;
      case RADIOLOGY_ASSISTANT -> ProfessionalTitle.RADIOLOGY_ASSISTANT;
      case SPORTS_THERAPIST -> ProfessionalTitle.SPORTS_THERAPIST;
      case PHARMACIST -> ProfessionalTitle.PHARMACIST;
      case VETERINARIAN -> ProfessionalTitle.VETERINARIAN;
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

  public static List<EmployeeDto> mapEmployeesToDto(
      List<Employee> employees, Map<UUID, ? extends PersonDetails> personDetails) {
    return employees.stream().map(employee -> mapEmployeeToDto(employee, personDetails)).toList();
  }

  public static EmployeeDto mapEmployeeToDto(
      Employee employee, Map<UUID, ? extends PersonDetails> personDetails) {
    PersonDetails employeeDetails = personDetails.get(employee.getCentralFileStateId());
    return new EmployeeDto(
        employeeDetails.firstName(), employeeDetails.lastName(), employeeDetails.dateOfBirth());
  }

  public static List<EmployeeChangeDto> mapEmployeeChangesToDto(
      List<EmployeeChange> employees, Map<UUID, PersonDetails> personDetails) {
    return employees.stream()
        .map(employeeChange -> mapEmployeeChangeToDto(employeeChange, personDetails))
        .toList();
  }

  public static EmployeeChangeDto mapEmployeeChangeToDto(
      EmployeeChange employeeChange, Map<UUID, ? extends PersonDetails> personDetails) {
    PersonDetails employeeDetails = personDetails.get(employeeChange.getCentralFileStateId());
    return new EmployeeChangeDto(
        employeeChange.getExternalId(),
        employeeDetails.firstName(),
        employeeDetails.lastName(),
        employeeDetails.dateOfBirth(),
        mapToDto(employeeChange.getEmployeeChangeType()));
  }

  private static EmployeeChangeTypeDto mapToDto(EmployeeChangeType employeeChangeType) {
    return switch (employeeChangeType) {
      case REMOVE -> EmployeeChangeTypeDto.REMOVE;
      case ADD -> EmployeeChangeTypeDto.ADD;
    };
  }
}

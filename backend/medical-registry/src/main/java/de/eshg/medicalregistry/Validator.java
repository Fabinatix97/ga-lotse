/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import de.eshg.file.common.FileType;
import de.eshg.file.common.FileTypeDetector;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.medicalregistry.api.ProfessionalReferencePersonDto;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntryChange;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.io.IOException;
import java.util.function.Consumer;
import java.util.function.UnaryOperator;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class Validator {
  private final PersonApi personApi;

  public Validator(PersonApi personApi) {
    this.personApi = personApi;
  }

  public void validateMergeTarget(
      MedicalRegistryEntry mergeTarget, ProfessionalReferencePersonDto referencePerson) {
    validateIsNotMedicalRegistryEntryChange(mergeTarget);
    validateProfessionalReferenceIsGiven(referencePerson);
    validateProfessionalMatchesToProcedure(referencePerson, mergeTarget);
  }

  private void validateProfessionalMatchesToProcedure(
      ProfessionalReferencePersonDto professionalReferencePerson,
      MedicalRegistryEntry medicalRegistryEntry) {
    GetReferencePersonResponse referencePerson =
        personApi.getReferencePerson(
            medicalRegistryEntry.getProfessional().getCentralFileStateId());

    if (!referencePerson.id().equals(professionalReferencePerson.referenceId())) {
      throw new BadRequestException(
          "professionalReferencePerson does not match reference person of procedure");
    }
  }

  public static void validateIsDraft(MedicalRegistryEntry procedure) {
    if (procedure.getProcedureStatus() != ProcedureStatus.DRAFT) {
      throw new BadRequestException(
          "Procedure %s is not in draft status and therefore cannot be deleted."
              .formatted(procedure.getExternalId()));
    }
  }

  public static void validateEmployeesEmployed(
      boolean employeesEmployed, MultipartFile employeeList) {
    if (employeesEmployed && employeeList == null) {
      throw new BadRequestException("Employee list is mandatory if employees are employed.");
    }
  }

  public static void validateFileType(MultipartFile multipartFile, FileType allowedFileType)
      throws IOException {
    FileType actualFileType = FileTypeDetector.getSupportedFileTypeOrThrow(multipartFile);
    if (actualFileType != allowedFileType) {
      throw new BadRequestException(
          ErrorCode.INVALID_FILE,
          String.format(
              "The file type of %s is not %s.", multipartFile.getName(), allowedFileType));
    }
  }

  private static void validateIsNotMedicalRegistryEntryChange(
      MedicalRegistryEntry medicalRegistryEntry) {
    if (medicalRegistryEntry instanceof MedicalRegistryEntryChange) {
      throw new BadRequestException("Procedure is change procedure");
    }
  }

  static MedicalRegistryEntryChange validateIsMedicalRegistryEntryChange(
      MedicalRegistryEntry medicalRegistryEntry) {
    if (medicalRegistryEntry instanceof MedicalRegistryEntryChange draftMedicalRegistryEntry) {
      return draftMedicalRegistryEntry;
    } else {
      throw new BadRequestException("Procedure is not a change procedure");
    }
  }

  public static void validateHasPractice(MedicalRegistryEntryChange draftMedicalRegistryEntry) {
    if (draftMedicalRegistryEntry.getRelatedFacilities().isEmpty()) {
      throw new BadRequestException("Practice must exist when linking to ReferenceFacility");
    }
  }

  private static void validateProfessionalReferenceIsGiven(
      ProfessionalReferencePersonDto professionalReferencePerson) {
    if (professionalReferencePerson == null) {
      throw new BadRequestException("professionalReferencePerson must not be null");
    }
  }

  public static <T> UnaryOperator<T> asMapper(Consumer<T> validator) {
    return element -> {
      validator.accept(element);
      return element;
    };
  }
}

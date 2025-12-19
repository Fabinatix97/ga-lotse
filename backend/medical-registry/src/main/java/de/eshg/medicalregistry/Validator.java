/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry;

import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import de.eshg.domain.model.SequencedBaseEntityWithExternalId;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.medicalregistry.api.ProfessionalReferencePersonDto;
import de.eshg.medicalregistry.api.ResolvedEmployeeChangeDto;
import de.eshg.medicalregistry.domain.model.FullMedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure;
import de.eshg.rest.service.error.BadRequestException;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.function.UnaryOperator;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class Validator {
  private final PersonApi personApi;

  public Validator(PersonApi personApi) {
    this.personApi = personApi;
  }

  public static void validateTargetEmployeeIdsExist(
      MedicalRegistryEntry mergeTarget, List<ResolvedEmployeeChangeDto> employeeChanges) {
    final Set<UUID> selectedEmployeeIds =
        employeeChanges.stream()
            .map(ResolvedEmployeeChangeDto::employeeId)
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());

    final Set<UUID> existingEmployeeIds =
        mergeTarget.getEmployees().stream()
            .map(SequencedBaseEntityWithExternalId::getExternalId)
            .collect(Collectors.toSet());

    if (!existingEmployeeIds.containsAll(selectedEmployeeIds)) {
      throw new BadRequestException("Selected target employee ids do not exist");
    }
  }

  public static void validateEmployeeChangesCorrespondToDraftChanges(
      MedicalRegistryEntryChange source, List<ResolvedEmployeeChangeDto> employeeChanges) {
    final Set<UUID> persistedEmployeeChangeIds =
        source.getEmployees().stream()
            .map(SequencedBaseEntityWithExternalId::getExternalId)
            .collect(Collectors.toSet());
    final Set<UUID> selectedEmployeeChangeIds =
        employeeChanges.stream()
            .map(ResolvedEmployeeChangeDto::employeeChangeId)
            .collect(Collectors.toSet());

    if (!persistedEmployeeChangeIds.equals(selectedEmployeeChangeIds)) {
      throw new BadRequestException(
          "Selected employeeChanges do not correspond to employeeChanges from draft.");
    }
  }

  public void validateMergeTarget(
      MedicalRegistryEntry mergeTarget,
      ProfessionalReferencePersonDto referencePerson,
      List<ResolvedEmployeeChangeDto> employeeChanges) {
    validateProfessionalReferenceIsGiven(referencePerson);
    validateProfessionalMatchesToProcedure(referencePerson, mergeTarget);
    Validator.validateTargetEmployeeIdsExist(mergeTarget, employeeChanges);
  }

  private void validateProfessionalMatchesToProcedure(
      ProfessionalReferencePersonDto professionalReferencePerson,
      MedicalRegistryProcedure medicalRegistryProcedure) {
    GetReferencePersonResponse referencePerson =
        personApi.getReferencePerson(
            medicalRegistryProcedure.getProfessional().getCentralFileStateId());

    if (!referencePerson.id().equals(professionalReferencePerson.id())) {
      throw new BadRequestException(
          "professionalReferencePerson does not match reference person of procedure");
    }
  }

  public static void validateIsDraft(MedicalRegistryProcedure procedure) {
    if (procedure.getProcedureStatus() != ProcedureStatus.DRAFT) {
      throw new BadRequestException(
          "Procedure %s is not in draft status and therefore cannot be deleted."
              .formatted(procedure.getExternalId()));
    }
  }

  public static void validateIsHasCompleteInformationForInitialConfirm(
      MedicalRegistryEntryChange entryChange, MedicalRegistryEntry mergeTarget) {
    if (entryChange instanceof FullMedicalRegistryEntryChange) {
      return;
    }

    if (mergeTarget == null) {
      throw new BadRequestException(
          "Only full procedure changes can be confirmed without merge target");
    }
  }

  static MedicalRegistryEntryChange validateIsMedicalRegistryEntryChange(
      MedicalRegistryProcedure medicalRegistryProcedure) {
    if (medicalRegistryProcedure instanceof MedicalRegistryEntryChange medicalRegistryEntryChange) {
      return medicalRegistryEntryChange;
    } else {
      throw new BadRequestException("Procedure is not a change procedure");
    }
  }

  public static MedicalRegistryEntry validateIsMedicalRegistryEntry(
      MedicalRegistryProcedure medicalRegistryProcedure) {
    if (medicalRegistryProcedure instanceof MedicalRegistryEntry medicalRegistryEntry) {
      return medicalRegistryEntry;
    } else {
      throw new BadRequestException("Procedure is not a medical registry entry");
    }
  }

  public static void validateHasPractice(MedicalRegistryProcedure draftMedicalRegistryEntry) {
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

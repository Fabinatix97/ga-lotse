/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import de.eshg.lib.procedure.procedures.ProcedureAsSearchableStringFormatter;
import de.eshg.medicalregistry.domain.model.FullMedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure;
import de.eshg.medicalregistry.domain.model.PartialMedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.ProfessionInformation;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class MedicalRegistryProcedureSearchableStringFormatter
    implements ProcedureAsSearchableStringFormatter<MedicalRegistryProcedure> {

  @Override
  public String formatAsSearchableString(MedicalRegistryProcedure procedure) {
    StringBuilder builder = new StringBuilder();
    getProfessionalInformation(procedure)
        .map(ProfessionInformation::getLifetimeDoctorNumber)
        .ifPresent(builder::append);
    procedure
        .getRelatedFacilities()
        .forEach(
            practice -> {
              Optional.ofNullable(practice.getEstablishmentNumber()).ifPresent(builder::append);
              Optional.ofNullable(practice.getInstitutionIdentifier()).ifPresent(builder::append);
            });
    return builder.toString();
  }

  private Optional<ProfessionInformation> getProfessionalInformation(
      MedicalRegistryProcedure source) {
    return switch (source) {
      case FullMedicalRegistryEntryChange fullProcedureChange ->
          Optional.of(fullProcedureChange.getProfessionInformation());
      case PartialMedicalRegistryEntryChange ignored -> Optional.empty();
      case MedicalRegistryEntry medicalRegistryEntry ->
          Optional.of(medicalRegistryEntry.getProfessionInformation());
      default -> throw new IllegalStateException("Unknown procedure type");
    };
  }
}

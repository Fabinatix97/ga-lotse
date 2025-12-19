/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.statistics;

import static de.eshg.lib.common.CountryCode.getCountryName;

import de.eshg.lib.common.CountryCode;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.lib.statistics.attributes.CentralFileIdFacilityAttribute;
import de.eshg.lib.statistics.attributes.CentralFileIdPersonAttribute;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.medicalregistry.domain.model.EmploymentStatus;
import de.eshg.medicalregistry.domain.model.EmploymentType;
import de.eshg.medicalregistry.domain.model.ProfessionalTitle;
import de.eshg.medicalregistry.domain.model.TypeOfChange;
import de.eshg.medicalregistry.statistics.support.EmploymentStatuses;
import de.eshg.medicalregistry.statistics.support.EmploymentTypes;
import de.eshg.medicalregistry.statistics.support.ProcedureStatuses;
import de.eshg.medicalregistry.statistics.support.ProfessionalTitles;
import de.eshg.medicalregistry.statistics.support.TypesOfChange;
import java.util.stream.Stream;

public enum MedicalRegistryProcedureAttributes implements AttributeInfo {
  PROCEDURE_STATUS(
      ValueWithOptionsAttribute.create(
          "Eintragsstatus",
          "PROCEDURE_STATUS",
          "Vorgang",
          true,
          Stream.of(ProcedureStatus.values()).map(ProcedureStatuses.toValueOption()).toList())),
  TYPE_OF_CHANGE(
      ValueWithOptionsAttribute.create(
          "Änderungsart",
          "TYPE_OF_CHANGE",
          "Vorgang",
          false,
          Stream.of(TypeOfChange.values()).map(TypesOfChange.toValueOption()).toList())),
  REQUEST_FOR_WRITTEN_CONFIRMATION(
      BooleanAttribute.create(
          "Meldebestätigung per Post", "REQUEST_FOR_WRITTEN_CONFIRMATION", "Vorgang", false)),
  PROFESSIONAL_CENTRAL_FILE_ID(
      CentralFileIdPersonAttribute.create(
          "Antragsteller", "PROFESSIONAL_CENTRAL_FILE_ID", "Antragsteller", true)),
  NATIONALITY(
      ValueWithOptionsAttribute.create(
          "Staatsangehörigkeit",
          "NATIONALITY",
          "Antragsteller",
          false,
          Stream.of(CountryCode.values())
              .map(e -> new ValueOptionInternal(e.name(), getCountryName(e), false))
              .toList())),
  PROFESSIONAL_TITLE(
      ValueWithOptionsAttribute.create(
          "Berufsbezeichnung",
          "PROFESSIONAL_TITLE",
          "Antragsteller",
          false,
          Stream.of(ProfessionalTitle.values()).map(ProfessionalTitles.toValueOption()).toList())),
  APPROBATION_GRANTED_ON(
      IntegerAttribute.create(
          "Approbation erteilt am", "APPROBATION_GRANTED_ON", "Antragsteller", true)),
  EMPLOYMENT_TYPE(
      ValueWithOptionsAttribute.create(
          "Haupt- / Nebenberuflich",
          "EMPLOYMENT_TYPE",
          "Antragsteller",
          false,
          Stream.of(EmploymentType.values()).map(EmploymentTypes.toValueOption()).toList())),
  EMPLOYMENT_STATUS(
      ValueWithOptionsAttribute.create(
          "Beschäftigungsstatus",
          "EMPLOYMENT_STATUS",
          "Antragsteller",
          false,
          Stream.of(EmploymentStatus.values()).map(EmploymentStatuses.toValueOption()).toList())),
  NUMBER_OF_EMPLOYEES(
      IntegerAttribute.create("Anzahl Mitarbeiter", "NUMBER_OF_EMPLOYEES", "Antragsteller", true)),
  OWN_PRACTICE(
      BooleanAttribute.create("Eigene Praxis / Niederlassung", "OWN_PRACTICE", "Praxis", true)),
  PRACTICE_CENTRAL_FILE_ID(
      CentralFileIdFacilityAttribute.create("Praxis", "PRACTICE_CENTRAL_FILE_ID", "Praxis", true)),
  HEALTH_INSURANCE_AUTHORIZATION(
      BooleanAttribute.create("Kassenzulassung", "HEALTH_INSURANCE_AUTHORIZATION", "Praxis", true)),
  ;

  private final AttributeData attribute;

  MedicalRegistryProcedureAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return this.attribute;
  }
}

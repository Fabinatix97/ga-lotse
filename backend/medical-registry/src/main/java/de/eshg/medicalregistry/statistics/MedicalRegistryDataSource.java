/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.statistics;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.procedure.domain.model.RelatedFacility;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.datasource.ProcedureDataSource;
import de.eshg.lib.statistics.util.TimeRange;
import de.eshg.medicalregistry.domain.model.FullMedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure;
import de.eshg.medicalregistry.domain.model.Practice;
import de.eshg.medicalregistry.domain.model.ProfessionInformation;
import de.eshg.medicalregistry.domain.model.Professional;
import de.eshg.medicalregistry.domain.model.TypeOfChange;
import de.eshg.medicalregistry.domain.repository.MedicalRegistryProcedureRepository;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class MedicalRegistryDataSource
    extends ProcedureDataSource<MedicalRegistryProcedure, MedicalRegistryProcedureAttributes> {

  public static final UUID DATA_SOURCE_ID = UUID.fromString("a9c32716-314c-4d77-936a-1fc4181c043f");
  public static final String DATA_SOURCE_NAME = "BMEDA";

  protected MedicalRegistryDataSource(MedicalRegistryProcedureRepository procedureRepository) {
    super(
        DATA_SOURCE_ID,
        DATA_SOURCE_NAME,
        DataSourceSensitivity.INTERNAL_USAGE,
        null,
        procedureRepository,
        MedicalRegistryProcedureAttributes.values());
  }

  @Override
  protected Object mapSpecificValue(
      MedicalRegistryProcedure entity,
      MedicalRegistryProcedureAttributes attribute,
      TimeRange timeRange) {
    return switch (attribute) {
      case PROCEDURE_STATUS -> entity.getProcedureStatus();
      case TYPE_OF_CHANGE -> typeOfChange(entity);
      case REQUEST_FOR_WRITTEN_CONFIRMATION -> entity.isRequestForWrittenConfirmation();
      case NATIONALITY -> nationality(entity);
      case PROFESSIONAL_TITLE -> professionInformation(entity).getProfessionalTitle();
      case PROFESSIONAL_CENTRAL_FILE_ID -> professionalCentralFileId(entity);
      case APPROBATION_GRANTED_ON -> approbationGrantedYear(entity);
      case EMPLOYMENT_TYPE -> professionInformation(entity).getEmploymentType();
      case EMPLOYMENT_STATUS -> professionInformation(entity).getEmploymentStatus();
      case NUMBER_OF_EMPLOYEES -> employees(entity);
      case OWN_PRACTICE -> !entity.getRelatedFacilities().isEmpty();
      case PRACTICE_CENTRAL_FILE_ID -> centralFileStateId(entity);
      case HEALTH_INSURANCE_AUTHORIZATION -> healthInsuranceAuthorization(entity);
    };
  }

  private static boolean healthInsuranceAuthorization(MedicalRegistryProcedure entity) {
    return entity.getRelatedFacilities().stream()
        .anyMatch(Practice::isHealthInsuranceAuthorization);
  }

  private static UUID centralFileStateId(MedicalRegistryProcedure entity) {
    return entity.getRelatedFacilities().stream()
        .map(RelatedFacility::getCentralFileStateId)
        .collect(StreamUtil.toSingleOptionalElement())
        .orElse(null);
  }

  private static CountryCode nationality(MedicalRegistryProcedure entity) {
    return entity.getOptionalProfessional().map(Professional::getNationality).orElse(null);
  }

  private static UUID professionalCentralFileId(MedicalRegistryProcedure entity) {
    return entity.getOptionalProfessional().map(RelatedPerson::getCentralFileStateId).orElse(null);
  }

  private static TypeOfChange typeOfChange(MedicalRegistryProcedure entity) {
    if (entity instanceof MedicalRegistryEntryChange change) {
      return change.getTypeOfChange();
    } else {
      return null;
    }
  }

  private static Integer approbationGrantedYear(MedicalRegistryProcedure entity) {
    return Optional.ofNullable(professionInformation(entity))
        .map(info -> info.getApprobationGrantedOn().getYear())
        .orElse(null);
  }

  private static ProfessionInformation professionInformation(MedicalRegistryProcedure entity) {
    if (entity instanceof MedicalRegistryEntry entry) {
      return entry.getProfessionInformation();
    } else if (entity instanceof FullMedicalRegistryEntryChange entry) {
      return entry.getProfessionInformation();
    } else {
      return null;
    }
  }

  private static Integer employees(MedicalRegistryProcedure entity) {
    if (entity instanceof MedicalRegistryEntry entry) {
      return entry.getEmployees().size();
    } else {
      return null;
    }
  }
}

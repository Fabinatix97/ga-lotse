/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.mapping;

import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.procedure.domain.model.ArchivingRelevance;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.StatisticsInclusion;
import de.eshg.lib.procedure.model.ArchivingRelevanceDto;
import de.eshg.lib.procedure.model.ArchivingRelevanceSettingsDto;
import de.eshg.lib.procedure.model.ProcedureDto;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.lib.procedure.model.ProcedureTypeDto;
import de.eshg.lib.procedure.model.StatisticsInclusionDto;

public final class ProcedureMapper {

  private ProcedureMapper() {}

  public static ProcedureDto toInterfaceType(
      Procedure<?, ?, ?, ?> domainModelProcedure,
      BusinessModule businessModule,
      String summary,
      ArchivingRelevance defaultArchivingRelevance) {
    return new ProcedureDto(
        businessModule,
        toInterfaceType(domainModelProcedure.getProcedureType()),
        domainModelProcedure.getCreatedAt(),
        domainModelProcedure.getModifiedAt(),
        domainModelProcedure.getClosedAt(),
        domainModelProcedure.getExportedAt(),
        toInterfaceType(domainModelProcedure.getProcedureStatus()),
        domainModelProcedure.getExternalId(),
        summary,
        new ArchivingRelevanceSettingsDto(
            toInterfaceType(domainModelProcedure.getArchivingRelevance()),
            toInterfaceType(defaultArchivingRelevance)),
        toInterfaceType(domainModelProcedure.getStatisticsInclusion()));
  }

  public static ProcedureStatusDto toInterfaceType(ProcedureStatus procedureStatus) {
    return switch (procedureStatus) {
      case DRAFT -> ProcedureStatusDto.DRAFT;
      case OPEN -> ProcedureStatusDto.OPEN;
      case IN_PROGRESS -> ProcedureStatusDto.IN_PROGRESS;
      case CLOSED -> ProcedureStatusDto.CLOSED;
      case ABORTED -> ProcedureStatusDto.ABORTED;
    };
  }

  public static ProcedureTypeDto toInterfaceType(ProcedureType procedureType) {
    return switch (procedureType) {
      case null -> null;
      case REGULAR_EXAMINATION -> ProcedureTypeDto.REGULAR_EXAMINATION;
      case CAN_CHILD -> ProcedureTypeDto.CAN_CHILD;
      case ENTRY_LEVEL -> ProcedureTypeDto.ENTRY_LEVEL;
      case DRAFT_CITIZEN_OFFICE_IMPORT -> ProcedureTypeDto.DRAFT_CITIZEN_OFFICE_IMPORT;
      case DRAFT_SCHOOL_IMPORT -> ProcedureTypeDto.DRAFT_SCHOOL_IMPORT;
      case INSPECTION -> ProcedureTypeDto.INSPECTION;
      case TM_VACCINATION_CONSULTATION -> ProcedureTypeDto.TM_VACCINATION_CONSULTATION;
      case MEASLES_PROTECTION -> ProcedureTypeDto.MEASLES_PROTECTION;
      case STI_PROTECTION -> ProcedureTypeDto.STI_PROTECTION;
      case MEDICAL_REGISTRY_ENTRY -> ProcedureTypeDto.MEDICAL_REGISTRY_ENTRY;
      case MEDICAL_REGISTRY_CITIZEN_DRAFT -> ProcedureTypeDto.MEDICAL_REGISTRY_CITIZEN_DRAFT;
      case MEDICAL_REGISTRY_EMPLOYEE_DRAFT -> ProcedureTypeDto.MEDICAL_REGISTRY_EMPLOYEE_DRAFT;
      case DENTAL_CHILD -> ProcedureTypeDto.DENTAL_CHILD;
      case OFFICIAL_MEDICAL_SERVICE -> ProcedureTypeDto.OFFICIAL_MEDICAL_SERVICE;
      case MEDS_ABROAD -> ProcedureTypeDto.MEDS_ABROAD;
      case PROSTITUTE_PROTECTION_INITIAL -> ProcedureTypeDto.PROSTITUTE_PROTECTION_INITIAL;
      case PROSTITUTE_PROTECTION_FOLLOW_UP -> ProcedureTypeDto.PROSTITUTE_PROTECTION_FOLLOW_UP;
      case INFECTION_BRIEFING_NEW -> ProcedureTypeDto.INFECTION_BRIEFING_NEW;
      case INFECTION_BRIEFING_REPLACEMENT -> ProcedureTypeDto.INFECTION_BRIEFING_REPLACEMENT;
    };
  }

  public static ArchivingRelevanceDto toInterfaceType(ArchivingRelevance archivingRelevance) {
    return switch (archivingRelevance) {
      case DEFAULT -> ArchivingRelevanceDto.DEFAULT;
      case RELEVANT -> ArchivingRelevanceDto.RELEVANT;
      case IRRELEVANT -> ArchivingRelevanceDto.IRRELEVANT;
    };
  }

  public static StatisticsInclusionDto toInterfaceType(StatisticsInclusion statisticsInclusion) {
    return switch (statisticsInclusion) {
      case INCLUDE -> StatisticsInclusionDto.INCLUDE;
      case CUSTOM -> StatisticsInclusionDto.CUSTOM;
      case EXCLUDE -> StatisticsInclusionDto.EXCLUDE;
    };
  }

  public static ProcedureType toDomainType(ProcedureTypeDto procedureType) {
    return switch (procedureType) {
      case null -> null;
      case REGULAR_EXAMINATION -> ProcedureType.REGULAR_EXAMINATION;
      case CAN_CHILD -> ProcedureType.CAN_CHILD;
      case ENTRY_LEVEL -> ProcedureType.ENTRY_LEVEL;
      case DRAFT_CITIZEN_OFFICE_IMPORT -> ProcedureType.DRAFT_CITIZEN_OFFICE_IMPORT;
      case DRAFT_SCHOOL_IMPORT -> ProcedureType.DRAFT_SCHOOL_IMPORT;
      case INSPECTION -> ProcedureType.INSPECTION;
      case TM_VACCINATION_CONSULTATION -> ProcedureType.TM_VACCINATION_CONSULTATION;
      case MEASLES_PROTECTION -> ProcedureType.MEASLES_PROTECTION;
      case STI_PROTECTION -> ProcedureType.STI_PROTECTION;
      case MEDICAL_REGISTRY_CITIZEN_DRAFT -> ProcedureType.MEDICAL_REGISTRY_CITIZEN_DRAFT;
      case MEDICAL_REGISTRY_EMPLOYEE_DRAFT -> ProcedureType.MEDICAL_REGISTRY_EMPLOYEE_DRAFT;
      case MEDICAL_REGISTRY_ENTRY -> ProcedureType.MEDICAL_REGISTRY_ENTRY;
      case DENTAL_CHILD -> ProcedureType.DENTAL_CHILD;
      case OFFICIAL_MEDICAL_SERVICE -> ProcedureType.OFFICIAL_MEDICAL_SERVICE;
      case MEDS_ABROAD -> ProcedureType.MEDS_ABROAD;
      case PROSTITUTE_PROTECTION_INITIAL -> ProcedureType.PROSTITUTE_PROTECTION_INITIAL;
      case PROSTITUTE_PROTECTION_FOLLOW_UP -> ProcedureType.PROSTITUTE_PROTECTION_FOLLOW_UP;
      case INFECTION_BRIEFING_NEW -> ProcedureType.INFECTION_BRIEFING_NEW;
      case INFECTION_BRIEFING_REPLACEMENT -> ProcedureType.INFECTION_BRIEFING_REPLACEMENT;
    };
  }

  public static ProcedureStatus toDomainType(ProcedureStatusDto procedureStatus) {
    return switch (procedureStatus) {
      case DRAFT -> ProcedureStatus.DRAFT;
      case OPEN -> ProcedureStatus.OPEN;
      case IN_PROGRESS -> ProcedureStatus.IN_PROGRESS;
      case CLOSED -> ProcedureStatus.CLOSED;
      case ABORTED -> ProcedureStatus.ABORTED;
    };
  }

  public static ArchivingRelevance toDomainType(ArchivingRelevanceDto archivingRelevance) {
    return switch (archivingRelevance) {
      case DEFAULT -> ArchivingRelevance.DEFAULT;
      case RELEVANT -> ArchivingRelevance.RELEVANT;
      case IRRELEVANT -> ArchivingRelevance.IRRELEVANT;
    };
  }

  public static StatisticsInclusion toDomainType(StatisticsInclusionDto statisticsInclusion) {
    return switch (statisticsInclusion) {
      case INCLUDE -> StatisticsInclusion.INCLUDE;
      case CUSTOM -> StatisticsInclusion.CUSTOM;
      case EXCLUDE -> StatisticsInclusion.EXCLUDE;
    };
  }
}

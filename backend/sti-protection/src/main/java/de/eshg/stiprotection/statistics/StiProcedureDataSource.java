/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.statistics;

import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.datasource.ProcedureDataSource;
import de.eshg.lib.statistics.util.TimeRange;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedureRepository;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure_;
import de.eshg.stiprotection.statistics.attributes.StiAttributes;
import de.eshg.stiprotection.statistics.attributes.StiConsultationAttributes;
import de.eshg.stiprotection.statistics.attributes.StiLaboratoryTestsAttributes;
import de.eshg.stiprotection.statistics.attributes.StiMedicalHistoryAttributes;
import de.eshg.stiprotection.statistics.attributes.StiPersonAttributes;
import de.eshg.stiprotection.statistics.attributes.StiProcedureAttributes;
import de.eshg.stiprotection.statistics.attributes.StiRapidTestsAttributes;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class StiProcedureDataSource
    extends ProcedureDataSource<StiProtectionProcedure, StiAttributes> {

  public static final UUID DATA_SOURCE_ID = UUID.fromString("d256b807-ac50-488e-9fe3-5abc50338ac9");
  public static final String DATA_SOURCE_NAME = "HIV/STI";

  public StiProcedureDataSource(StiProtectionProcedureRepository stiProcedureRepository) {
    super(
        DATA_SOURCE_ID,
        DATA_SOURCE_NAME,
        DataSourceSensitivity.SENSITIVE,
        5,
        stiProcedureRepository,
        StiAttributes.allAttributes());
  }

  @Override
  protected Object mapSpecificValue(
      StiProtectionProcedure procedure, StiAttributes attribute, TimeRange timeRange) {
    return switch (attribute) {
      case StiProcedureAttributes procedureAttributes ->
          StiProcedureAttributes.mapAttribute(procedure, procedureAttributes);
      case StiPersonAttributes personAttributes ->
          StiPersonAttributes.mapAttribute(procedure, personAttributes);
      case StiMedicalHistoryAttributes medicalHistoryAttributes ->
          StiMedicalHistoryAttributes.mapAttribute(procedure, medicalHistoryAttributes);
      case StiConsultationAttributes stiConsultationAttributes ->
          StiConsultationAttributes.mapAttribute(procedure, stiConsultationAttributes);
      case StiRapidTestsAttributes stiRapidTestsAttributes ->
          StiRapidTestsAttributes.mapAttribute(procedure, stiRapidTestsAttributes);
      case StiLaboratoryTestsAttributes stiLaboratoryTestsAttributes ->
          StiLaboratoryTestsAttributes.mapAttribute(procedure, stiLaboratoryTestsAttributes);
    };
  }

  @Override
  protected Specification<StiProtectionProcedure> getProcedureSpecification(TimeRange timeRange) {
    return (root, query, criteriaBuilder) ->
        isInTimeRange(criteriaBuilder, root.get(StiProtectionProcedure_.createdAt), timeRange);
  }
}

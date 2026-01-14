/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.statistics;

import de.eshg.domain.model.BaseEntity_;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.datasource.EntityDataSource;
import de.eshg.lib.statistics.util.TimeRange;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.Vaccination;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationRepository;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.Vaccination_;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class VaccinationDataSource extends EntityDataSource<Vaccination, VaccinationAttributes> {

  public static final UUID DATA_SOURCE_ID = UUID.fromString("e3e84fc7-d55f-45d7-b6c8-38d8f85db9d8");
  public static final String DATA_SOURCE_NAME = "Impfungen";
  private final VaccinationRepository vaccinationRepository;

  public VaccinationDataSource(VaccinationRepository vaccinationRepository) {
    super(
        DATA_SOURCE_ID,
        DATA_SOURCE_NAME,
        DataSourceSensitivity.INTERNAL_USAGE,
        null,
        VaccinationAttributes.values());
    this.vaccinationRepository = vaccinationRepository;
  }

  @Override
  protected Page<Vaccination> retrieveEntities(TimeRange timeRange, int page, int pageSize) {
    return vaccinationRepository.findAll(
        getProcedureSpecification(timeRange),
        PageRequest.of(
            page,
            pageSize,
            Sort.by(
                Sort.Direction.ASC,
                Vaccination_.DISEASE_NAME,
                Vaccination_.VACCINE_NAME,
                Vaccination_.VACCINATION_TYPE,
                Vaccination_.VACCINATION_NUMBER,
                BaseEntity_.ID)));
  }

  protected Specification<Vaccination> getProcedureSpecification(TimeRange timeRange) {
    return (root, query, criteriaBuilder) ->
        isInTimeRange(criteriaBuilder, root.get(Vaccination_.createdAt), timeRange);
  }

  @Override
  protected Object mapSpecificValue(
      Vaccination entity, VaccinationAttributes attribute, TimeRange timeRange) {
    return switch (attribute) {
      case PROCEDURE_ID -> entity.getVaccinationConsultation().getExternalId();
      case PERSON_CENTRAL_FILE_ID ->
          entity.getVaccinationConsultation().getPatientIdsFromCentralFile().getFirst();
      case DISEASE -> entity.getDiseaseName();
      case VACCINE -> entity.getVaccineName();
      case VACCINATION_TYPE -> entity.getVaccinationType().toString();
      case VACCINATION_NUMBER -> entity.getVaccinationNumber();
    };
  }
}

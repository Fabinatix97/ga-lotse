/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.travelmedicine.util.MappingUtil;
import de.eshg.travelmedicine.vaccinationconsultation.api.CreatedByUserTypeDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatientDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.VaccinationConsultationSearchDto;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultationSearch;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SearchVaccinationConsultationFilterAndMapper {
  private static final Logger log =
      LoggerFactory.getLogger(SearchVaccinationConsultationFilterAndMapper.class);

  private SearchVaccinationConsultationFilterAndMapper() {}

  public static List<VaccinationConsultationSearchDto> filterAndMapSearchResults(
      List<VaccinationConsultationSearch> vaccinationConsultations,
      Map<UUID, PatientDto> personsFromCentralFile,
      String firstNameFilter,
      String lastNameFilter,
      LocalDate dateOfBirthFilter) {

    List<VaccinationConsultationSearchDto> searchResult = new ArrayList<>();
    for (VaccinationConsultationSearch vc : vaccinationConsultations) {
      PatientDto patient = personsFromCentralFile.get(vc.fileState());
      if (patient == null) {
        if (log.isInfoEnabled()) {
          log.info(
              String.format("Person for fileState %s not found in central file.", vc.fileState()));
        }
      } else {
        if (dateOfBirthFilter != null && !dateOfBirthFilter.equals(patient.dateOfBirth())
            || firstNameFilter != null
                && !StringUtils.containsIgnoreCase(patient.firstName(), firstNameFilter)
            || lastNameFilter != null
                && !StringUtils.containsIgnoreCase(patient.lastName(), lastNameFilter)) {
          continue;
        }

        searchResult.add(
            new VaccinationConsultationSearchDto(
                vc.procedureId(),
                patient.firstName(),
                patient.lastName(),
                patient.dateOfBirth(),
                vc.travelStartDate(),
                MappingUtil.mapEnum(ProcedureStatusDto.class, vc.status()),
                MappingUtil.mapEnum(CreatedByUserTypeDto.class, vc.createdBy())));
      }
    }
    return searchResult;
  }
}

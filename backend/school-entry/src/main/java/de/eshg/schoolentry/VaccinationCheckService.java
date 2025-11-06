/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.schoolentry.api.vaccination.MeaslesVaccinationDto;
import de.eshg.schoolentry.api.vaccination.VaccinationCheckResponse;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.repository.SchoolEntryProcedureRepository;
import de.eshg.schoolentry.mapper.VaccinationStatusMapper;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VaccinationCheckService {

  private final SchoolEntryProcedureRepository schoolEntryProcedureRepository;

  public VaccinationCheckService(SchoolEntryProcedureRepository schoolEntryProcedureRepository) {
    this.schoolEntryProcedureRepository = schoolEntryProcedureRepository;
  }

  @Transactional
  public VaccinationCheckResponse checkVaccinationStatus(List<UUID> fileStateIds) {
    List<SchoolEntryProcedure> procedures =
        schoolEntryProcedureRepository.findByRelatedPersonsCentralFileStateId(fileStateIds).stream()
            .filter(
                procedure -> fileStateIds.contains(procedure.getChild().getCentralFileStateId()))
            .toList();
    List<MeaslesVaccinationDto> results =
        procedures.stream()
            .map(SchoolEntryProcedure::getVaccinationStatus)
            .map(VaccinationStatusMapper::mapToMeaslesVaccinationStatusDto)
            .distinct()
            .toList();
    if (results.size() == 1) {
      return new VaccinationCheckResponse(results.getFirst());
    } else {
      return new VaccinationCheckResponse(null);
    }
  }
}

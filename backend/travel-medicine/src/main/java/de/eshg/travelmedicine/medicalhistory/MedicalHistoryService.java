/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.medicalhistory;

import static de.eshg.travelmedicine.medicalhistory.MedicalHistoryHelper.isMedicalHistoryCompletelyAnswered;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.travelmedicine.medicalhistory.api.MedicalHistoryDto;
import de.eshg.travelmedicine.medicalhistory.api.PatchMedicalHistoryRequest;
import de.eshg.travelmedicine.medicalhistory.persistence.entity.MedicalHistory;
import de.eshg.travelmedicine.vaccinationconsultation.ProcedureAccessor;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetMedicalHistoriesResponse;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class MedicalHistoryService {

  private final ProcedureAccessor procedureAccessor;

  public MedicalHistoryService(ProcedureAccessor procedureAccessor) {
    this.procedureAccessor = procedureAccessor;
  }

  public void patchMedicalHistory(
      UUID medicalHistoryId, PatchMedicalHistoryRequest patchMedicalHistoryRequest) {
    MedicalHistory medicalHistory =
        procedureAccessor.accessMedicalHistory(
            medicalHistoryId, null, ProcedureAccessor.checkNotClosed);

    ObjectMapper objectMapper = new ObjectMapper();
    try {
      medicalHistory.setContent(
          objectMapper.writeValueAsString(patchMedicalHistoryRequest.medicalHistoryContent()));
    } catch (JsonProcessingException e) {
      throw new BadRequestException("Content does not match required structure");
    }
    medicalHistory.setNote(patchMedicalHistoryRequest.note());
    medicalHistory.setCompletelyAnswered(
        isMedicalHistoryCompletelyAnswered(patchMedicalHistoryRequest.medicalHistoryContent()));
  }

  public GetMedicalHistoriesResponse getMedicalHistories(
      VaccinationConsultation vaccinationConsultation) {
    List<MedicalHistoryDto> medicalHistories =
        vaccinationConsultation.getProcedureSteps().stream()
            .filter(ps -> ps.getMedicalHistory() != null)
            .map(ps -> MedicalHistoryMapper.toInterfaceType(ps.getMedicalHistory(), ps))
            .sorted(Comparator.comparing(MedicalHistoryDto::appointment))
            .toList();
    return new GetMedicalHistoriesResponse(
        vaccinationConsultation.getExternalId(), medicalHistories);
  }
}

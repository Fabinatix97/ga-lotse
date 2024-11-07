/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document.medicalhistory;

import static de.eshg.travelmedicine.document.DocumentDtoHelper.isDocumentContentCompletelyAnswered;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.travelmedicine.document.api.DocumentContentDto;
import de.eshg.travelmedicine.document.medicalhistory.api.MedicalHistoryDto;
import de.eshg.travelmedicine.document.medicalhistory.api.PatchMedicalHistoryRequest;
import de.eshg.travelmedicine.document.medicalhistory.persistence.entity.MedicalHistory;
import de.eshg.travelmedicine.vaccinationconsultation.ProcedureAccessor;
import de.eshg.travelmedicine.vaccinationconsultation.api.GetMedicalHistoriesResponse;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStep;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class MedicalHistoryService {

  private final ProcedureAccessor procedureAccessor;
  private final ObjectMapper objectMapper = new ObjectMapper();

  public MedicalHistoryService(ProcedureAccessor procedureAccessor) {
    this.procedureAccessor = procedureAccessor;
  }

  public GetMedicalHistoriesResponse getMedicalHistoriesForEmployeePortal(UUID procedureId) {
    VaccinationConsultation vaccinationConsultation =
        procedureAccessor.accessProcedure(procedureId, ProcedureAccessor.noChecks);

    List<MedicalHistoryDto> medicalHistories =
        vaccinationConsultation.getProcedureSteps().stream()
            .filter(ps -> ps.getMedicalHistory() != null)
            .map(ps -> MedicalHistoryMapper.toInterfaceType(ps.getMedicalHistory(), ps))
            .sorted(Comparator.comparing(MedicalHistoryDto::appointment))
            .toList();
    return new GetMedicalHistoriesResponse(
        vaccinationConsultation.getExternalId(), medicalHistories);
  }

  public DocumentContentDto getMedicalHistoryForCitizenPortal(
      UUID citizenUserId, UUID procedureId, UUID procedureStepId) {
    ProcedureStep procedureStep =
        procedureAccessor.accessProcedureStep(
            procedureStepId,
            procedureId,
            List.of(
                new ProcedureAccessor.CheckNotClosed(),
                new ProcedureAccessor.CheckCitizenUserId(citizenUserId)));

    if (procedureStep.getMedicalHistory().isCitizenHasAnswered()) {
      throw new BadRequestException("Medical history already answered.");
    }

    return MedicalHistoryMapper.contentToInterfaceType(procedureStep.getMedicalHistory());
  }

  public void patchMedicalHistoryForEmployeePortal(
      UUID medicalHistoryId, PatchMedicalHistoryRequest patchMedicalHistoryRequest) {
    MedicalHistory medicalHistory =
        procedureAccessor.accessMedicalHistory(
            medicalHistoryId, null, ProcedureAccessor.checkNotClosed);

    String oldContent = medicalHistory.getContent();
    String newContent = toJsonString(patchMedicalHistoryRequest.medicalHistoryContent());
    if (!oldContent.equals(newContent)) {
      medicalHistory.setContent(newContent);
      medicalHistory.setCitizenHasAnswered(true);
    }

    medicalHistory.setNote(patchMedicalHistoryRequest.note());
    medicalHistory.setCompletelyAnswered(
        isDocumentContentCompletelyAnswered(patchMedicalHistoryRequest.medicalHistoryContent()));
  }

  public void patchMedicalHistoryForCitizenPortal(
      UUID citizenUserId,
      UUID procedureId,
      UUID procedureStepId,
      DocumentContentDto patchMedicalHistoryContent) {
    ProcedureStep procedureStep =
        procedureAccessor.accessProcedureStep(
            procedureStepId,
            procedureId,
            List.of(
                new ProcedureAccessor.CheckNotClosed(),
                new ProcedureAccessor.CheckCitizenUserId(citizenUserId)));
    MedicalHistory medicalHistory = procedureStep.getMedicalHistory();
    if (medicalHistory.isCitizenHasAnswered()) {
      throw new BadRequestException("Medical history already answered by citizen.");
    }

    medicalHistory.setContent(toJsonString(patchMedicalHistoryContent));
    medicalHistory.setCompletelyAnswered(
        isDocumentContentCompletelyAnswered(patchMedicalHistoryContent));
    medicalHistory.setCitizenHasAnswered(true);
  }

  private String toJsonString(Object content) {
    try {
      return objectMapper.writeValueAsString(content);
    } catch (JsonProcessingException e) {
      throw new BadRequestException("Content does not match required structure");
    }
  }
}

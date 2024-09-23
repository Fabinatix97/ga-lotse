/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.medicalhistory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.travelmedicine.medicalhistory.api.MedicalHistoryContentDto;
import de.eshg.travelmedicine.medicalhistory.api.MedicalHistoryDto;
import de.eshg.travelmedicine.medicalhistory.api.MedicalHistorySectionDto;
import de.eshg.travelmedicine.medicalhistory.api.MedicalHistorySectionElementDataDto;
import de.eshg.travelmedicine.medicalhistory.api.MedicalHistorySectionElementDto;
import de.eshg.travelmedicine.medicalhistory.api.MedicalHistorySubElementMultiSelectDto;
import de.eshg.travelmedicine.medicalhistory.api.MedicalHistorySubElementTextDto;
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
    medicalHistory.setAnswered(
        isMedicalHistoryAnswered(patchMedicalHistoryRequest.medicalHistoryContent()));
  }

  protected boolean isMedicalHistoryAnswered(MedicalHistoryContentDto medicalHistoryContentDto) {
    for (MedicalHistorySectionDto section : medicalHistoryContentDto.medicalHistorySections()) {
      if (!isSectionAnswered(section)) {
        return false;
      }
    }
    return true;
  }

  private boolean isSectionAnswered(MedicalHistorySectionDto section) {
    for (MedicalHistorySectionElementDto sectionElement : section.medicalHistorySectionElements()) {
      MedicalHistorySectionElementDataDto data = sectionElement.medicalHistorySectionElement();

      // simple question
      if (data.medicalHistorySubElementMultiSelects().isEmpty()
          && data.medicalHistorySubElementText() == null
          && (!isAnsweredSimpleQuestion(data))) {
        return false;
      }

      // free text question
      if (data.medicalHistorySubElementMultiSelects().isEmpty()
          && data.medicalHistorySubElementText() != null
          && (!isAnsweredFreeTextQuestion(data))) {
        return false;
      }

      // multiple choice question without free text question
      if (!data.medicalHistorySubElementMultiSelects().isEmpty()
          && data.medicalHistorySubElementText() == null
          && (!isAnsweredMultipleChoiceQuestionWithoutFreeTextQuestion(data))) {
        return false;
      }

      // multiple choice question with free text question
      if (!data.medicalHistorySubElementMultiSelects().isEmpty()
          && data.medicalHistorySubElementText() != null
          && (!isAnsweredMultipleChoiceQuestionWithFreeTextQuestion(data))) {
        return false;
      }
    }
    return true;
  }

  private boolean isAnsweredSimpleQuestion(MedicalHistorySectionElementDataDto data) {
    // simple question should be answered with yes or no
    return data.answer() != null;
  }

  private boolean isAnsweredFreeTextQuestion(MedicalHistorySectionElementDataDto data) {
    // free text / open question should be answered with no or have (when answering the question
    // with yes) a non-blank free text field
    return Boolean.FALSE.equals(data.answer())
        || (Boolean.TRUE.equals(data.answer())
            && isSubelementTextAnswered(data.medicalHistorySubElementText()));
  }

  private boolean isAnsweredMultipleChoiceQuestionWithoutFreeTextQuestion(
      MedicalHistorySectionElementDataDto data) {
    // multiple choice question should be answered with no or have (when answering the question with
    // yes) a non-blank free text field and/or at least one marked multiple choice answer
    return Boolean.FALSE.equals(data.answer())
        || (Boolean.TRUE.equals(data.answer())
            && isMultiSelectAnswered(data.medicalHistorySubElementMultiSelects()));
  }

  private boolean isAnsweredMultipleChoiceQuestionWithFreeTextQuestion(
      MedicalHistorySectionElementDataDto data) {
    // multiple choice question should be answered with no or have (when answering the question with
    // yes) a non-blank free text field and/or at least one marked multiple choice answer
    return Boolean.FALSE.equals(data.answer())
        || (Boolean.TRUE.equals(data.answer())
            && (isSubelementTextAnswered(data.medicalHistorySubElementText())
                || isMultiSelectAnswered(data.medicalHistorySubElementMultiSelects())));
  }

  private boolean isMultiSelectAnswered(
      List<MedicalHistorySubElementMultiSelectDto> medicalHistorySubElementMultiSelects) {
    return medicalHistorySubElementMultiSelects.stream()
        .anyMatch(multiSelect -> Boolean.TRUE.equals(multiSelect.answer()));
  }

  private boolean isSubelementTextAnswered(MedicalHistorySubElementTextDto text) {
    if (text == null) {
      return false;
    }
    return text.answer() != null && !text.answer().isBlank();
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

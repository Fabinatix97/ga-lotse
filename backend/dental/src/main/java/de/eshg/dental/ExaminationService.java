/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import de.cronn.reflection.util.ClassUtils;
import de.eshg.dental.api.AbsenceExaminationResultDto;
import de.eshg.dental.api.ExaminationResultDto;
import de.eshg.dental.api.FluoridationExaminationResultDto;
import de.eshg.dental.api.ScreeningExaminationResultDto;
import de.eshg.dental.api.UpdateExaminationRequest;
import de.eshg.dental.domain.model.AbsenceExaminationResult;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.model.ExaminationResult;
import de.eshg.dental.domain.model.FluoridationExaminationResult;
import de.eshg.dental.domain.model.ProphylaxisSession;
import de.eshg.dental.domain.model.ScreeningExaminationResult;
import de.eshg.dental.domain.repository.ExaminationRepository;
import de.eshg.dental.mapper.ExaminationMapper;
import de.eshg.dental.util.ChildSystemProgressEntryType;
import de.eshg.dental.util.ExceptionUtil;
import de.eshg.dental.util.ProgressEntryUtil;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.validation.ValidationUtil;
import java.util.UUID;
import java.util.function.Consumer;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
public class ExaminationService {

  private final ExaminationRepository examinationRepository;
  private final ProgressEntryUtil progressEntryUtil;

  public ExaminationService(
      ExaminationRepository examinationRepository, ProgressEntryUtil progressEntryUtil) {
    this.examinationRepository = examinationRepository;
    this.progressEntryUtil = progressEntryUtil;
  }

  Examination findExamination(UUID examinationId) {
    return examinationRepository
        .findByExternalId(examinationId)
        .orElseThrow(ExaminationService::examinationNotFoundException);
  }

  Examination findExaminationForUpdate(UUID examinationId) {
    return examinationRepository
        .findOneByExternalIdForUpdate(examinationId)
        .orElseThrow(ExaminationService::examinationNotFoundException);
  }

  void updateExamination(Examination examination, UpdateExaminationRequest request) {
    ValidationUtil.validateVersion(request.version(), examination);
    examination.setNote(request.note());
    updateResult(examination, request.result());
    progressEntryUtil.addSystemProgressEntry(
        examination.getChild(), ChildSystemProgressEntryType.EXAMINATION_MODIFIED);
    examinationRepository.flush();
  }

  private void updateResult(Examination examination, ExaminationResultDto newResult) {
    validateExaminationResult(examination, newResult);
    switch (newResult) {
      case null -> examination.setResult(null);
      case FluoridationExaminationResultDto fluoridationExaminationResult ->
          mapResult(examination, fluoridationExaminationResult);
      case ScreeningExaminationResultDto screeningExaminationResult ->
          mapResult(examination, screeningExaminationResult);
      case AbsenceExaminationResultDto absenceExaminationResult ->
          mapResult(examination, absenceExaminationResult);
    }
  }

  private void mapResult(Examination examination, FluoridationExaminationResultDto newResult) {
    mapResult(
        examination,
        FluoridationExaminationResult.class,
        existingResult ->
            existingResult.setFluorideVarnishApplied(newResult.fluorideVarnishApplied()));
  }

  private static void validateExaminationResult(
      Examination examination, ExaminationResultDto newResult) {
    if (newResult == null || newResult instanceof AbsenceExaminationResultDto) {
      return;
    }

    ProphylaxisSession prophylaxisSession = examination.getProphylaxisSession();
    if (prophylaxisSession.isScreening()) {
      if (!(newResult instanceof ScreeningExaminationResultDto screeningExaminationResult)) {
        throw newIllegalExaminationResultException(newResult, ScreeningExaminationResultDto.class);
      }
      if (screeningExaminationResult.fluorideVarnishApplied()
          && !prophylaxisSession.hasFluoridationVarnish()) {
        throw newIllegalExaminationResultException(
            "Got fluorideVarnishApplied=true but no fluoridation varnish is configured for prophylaxis session");
      }
    } else if (prophylaxisSession.hasFluoridationVarnish()) {
      if (!(newResult instanceof FluoridationExaminationResultDto)) {
        throw newIllegalExaminationResultException(
            newResult, FluoridationExaminationResultDto.class);
      }
    } else {
      throw newIllegalExaminationResultException(newResult, null);
    }
  }

  private static BadRequestException newIllegalExaminationResultException(
      ExaminationResultDto actualResult, Class<? extends ExaminationResultDto> expectedResultType) {
    return newIllegalExaminationResultException(
        "Wrong examination result type. Got %s but expected %s"
            .formatted(
                actualResult.getClass().getSimpleName(),
                expectedResultType == null ? "null" : expectedResultType.getSimpleName()));
  }

  private static BadRequestException newIllegalExaminationResultException(String internalMessage) {
    return new BadRequestException("Illegal examination result", internalMessage);
  }

  private void mapResult(Examination examination, ScreeningExaminationResultDto newResult) {
    mapResult(
        examination,
        ScreeningExaminationResult.class,
        existingResult -> {
          existingResult.setFluorideVarnishApplied(newResult.fluorideVarnishApplied());
          existingResult.setOralHygieneStatus(
              ExaminationMapper.mapToDomain(newResult.oralHygieneStatus()));
          existingResult.setToothDiagnoses(
              ExaminationMapper.mapToDomain(newResult.toothDiagnoses()));
        });
  }

  private void mapResult(Examination examination, AbsenceExaminationResultDto newResult) {
    mapResult(
        examination,
        AbsenceExaminationResult.class,
        existingResult ->
            existingResult.setReasonForAbsence(
                ExaminationMapper.mapToDomain(newResult.reasonForAbsence())));
  }

  private <R extends ExaminationResult> void mapResult(
      Examination examination, Class<R> expectedResultClass, Consumer<R> mapping) {
    ExaminationResult existingResult = examination.getResult();
    if (existingResult != null) {
      Class<? extends ExaminationResult> examinationResultClass =
          ClassUtils.getRealClass(existingResult);
      Assert.isTrue(
          examinationResultClass.equals(expectedResultClass),
          () ->
              "Cannot change examination result class from %s to %s"
                  .formatted(examinationResultClass, expectedResultClass));
      @SuppressWarnings("unchecked") // We actually did check the type
      R castedResult = (R) existingResult;
      mapping.accept(castedResult);
    } else {
      R result = ClassUtils.createNewInstance(expectedResultClass);
      mapping.accept(result);
      examination.setResult(result);
    }
  }

  private static NotFoundException examinationNotFoundException() {
    return ExceptionUtil.notFoundException(Examination.class);
  }
}

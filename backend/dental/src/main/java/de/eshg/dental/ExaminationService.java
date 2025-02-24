/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import de.cronn.reflection.util.ClassUtils;
import de.eshg.dental.api.AbsenceExaminationResultDto;
import de.eshg.dental.api.ExaminationResultDto;
import de.eshg.dental.api.FluoridationExaminationResultDto;
import de.eshg.dental.api.IsFluorideVarnishApplicable;
import de.eshg.dental.api.ScreeningExaminationResultDto;
import de.eshg.dental.api.UpdateExaminationRequest;
import de.eshg.dental.domain.model.AbsenceExaminationResult;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.model.ExaminationResult;
import de.eshg.dental.domain.model.FluoridationExaminationResult;
import de.eshg.dental.domain.model.ProphylaxisSession;
import de.eshg.dental.domain.model.ScreeningExaminationResult;
import de.eshg.dental.domain.repository.ExaminationRepository;
import de.eshg.dental.mapper.DentitionTypeMapper;
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

  void updateExaminationAndFlush(Examination examination, UpdateExaminationRequest request) {
    updateExamination(examination, request);
    examinationRepository.flush();
  }

  void updateExamination(Examination examination, UpdateExaminationRequest request) {
    ValidationUtil.validateVersion(request.version(), examination);
    examination.setNote(request.note());
    updateResult(examination, request.result());
    progressEntryUtil.addSystemProgressEntry(
        examination.getChild(), ChildSystemProgressEntryType.EXAMINATION_MODIFIED);
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
    if (newResult == null) {
      return;
    }

    ProphylaxisSession prophylaxisSession = examination.getProphylaxisSession();
    if (prophylaxisSession.isScreening()) {
      if (newResult instanceof AbsenceExaminationResultDto) {
        return;
      }
      if (!(newResult instanceof ScreeningExaminationResultDto screeningExaminationResult)) {
        throw newIllegalExaminationResultException(newResult, ScreeningExaminationResultDto.class);
      }
      if (screeningExaminationResult.isFluorideVarnishAppliedOrFalse()
          && !prophylaxisSession.hasFluoridationVarnish()) {
        throw newIllegalExaminationResultException(
            "Got fluorideVarnishApplied=true but no fluoridation varnish is configured for prophylaxis session");
      }
      Validator.validateToothDiagnoses(screeningExaminationResult.toothDiagnoses());
    } else if (prophylaxisSession.hasFluoridationVarnish()) {
      if (newResult instanceof AbsenceExaminationResultDto) {
        return;
      }
      if (!(newResult instanceof FluoridationExaminationResultDto)) {
        throw newIllegalExaminationResultException(
            newResult, FluoridationExaminationResultDto.class);
      }
    } else {
      throw newIllegalExaminationResultException(newResult, null);
    }

    if (newResult instanceof IsFluorideVarnishApplicable fluorideVarnishApplicableResult
        && fluorideVarnishApplicableResult.isFluorideVarnishAppliedOrFalse()
        && !examination.getChild().isFluoridationConsentCurrentlyGiven()) {
      throw newIllegalExaminationResultException(
          "Got fluorideVarnishApplied=true but fluoridation consent is not given");
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
          existingResult.setDentitionType(
              DentitionTypeMapper.mapToDomain(newResult.dentitionType()));
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
    if (existingResult == null || existingResult instanceof AbsenceExaminationResult) {
      acceptAndSetResult(examination, expectedResultClass, mapping);
    } else {
      Class<? extends ExaminationResult> examinationResultClass =
          ClassUtils.getRealClass(existingResult);
      if (!examinationResultClass.equals(expectedResultClass)) {
        throw new BadRequestException(
            "Illegal examination result type",
            "Cannot change examination result class from %s to %s"
                .formatted(examinationResultClass, expectedResultClass));
      }
      @SuppressWarnings("unchecked") // We actually did check the type
      R castedResult = (R) existingResult;
      mapping.accept(castedResult);
    }
  }

  private static <R extends ExaminationResult> void acceptAndSetResult(
      Examination examination, Class<R> expectedResultClass, Consumer<R> mapping) {
    R result = ClassUtils.createNewInstance(expectedResultClass);
    mapping.accept(result);
    examination.setResult(result);
  }

  private static NotFoundException examinationNotFoundException() {
    return ExceptionUtil.notFoundException(Examination.class);
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import de.cronn.reflection.util.ClassUtils;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.dental.api.AbsenceExaminationResultDto;
import de.eshg.dental.api.ExaminationResultDto;
import de.eshg.dental.api.FluoridationExaminationResultDto;
import de.eshg.dental.api.IsFluorideVarnishApplicable;
import de.eshg.dental.api.ScreeningExaminationResultDto;
import de.eshg.dental.api.UpdateExaminationRequest;
import de.eshg.dental.client.PersonClient;
import de.eshg.dental.domain.model.AbsenceExaminationResult;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.model.ExaminationResult;
import de.eshg.dental.domain.model.FluoridationExaminationResult;
import de.eshg.dental.domain.model.ProphylaxisSession;
import de.eshg.dental.domain.model.ScreeningExaminationResult;
import de.eshg.dental.domain.repository.ExaminationRepository;
import de.eshg.dental.mapper.DentitionTypeMapper;
import de.eshg.dental.mapper.ExaminationMapper;
import de.eshg.dental.mapper.OrthodonticFindingMapper;
import de.eshg.dental.statistic.StatisticsCalculationHelper;
import de.eshg.dental.util.ChildSystemProgressEntryType;
import de.eshg.dental.util.ExceptionUtil;
import de.eshg.dental.util.ProgressEntryUtil;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.validation.ValidationUtil;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.function.Consumer;
import org.springframework.stereotype.Component;

@Component
public class ExaminationService {

  private final ExaminationRepository examinationRepository;
  private final ProgressEntryUtil progressEntryUtil;
  private final PersonClient personClient;
  private final ChildService childService;

  public ExaminationService(
      ExaminationRepository examinationRepository,
      ProgressEntryUtil progressEntryUtil,
      PersonClient personClient,
      ChildService childService) {
    this.examinationRepository = examinationRepository;
    this.progressEntryUtil = progressEntryUtil;
    this.personClient = personClient;
    this.childService = childService;
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
    updateResult(examination, request.result());
    Child child = examination.getChild();
    child.setNote(request.note());

    addModifiedSystemProgressEntry(child);
  }

  private void addModifiedSystemProgressEntry(Child child) {
    boolean hasBeenClosed = child.getProcedureStatus() == ProcedureStatus.CLOSED;
    if (hasBeenClosed) {
      childService.reopenChild(child);
    }

    progressEntryUtil.addSystemProgressEntry(
        child, ChildSystemProgressEntryType.EXAMINATION_MODIFIED);

    if (hasBeenClosed) {
      childService.closeChild(child);
    }
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
          existingResult.setMihStatus(ExaminationMapper.mapToDomain(newResult.mihStatus()));
          existingResult.setOrthodonticFindings(
              OrthodonticFindingMapper.mapToDomain(newResult.orthodonticFindings()));
          existingResult.setOrthodonticStatus(
              ExaminationMapper.mapToDomain(newResult.orthodonticStatus()));
          existingResult.setDentitionType(
              DentitionTypeMapper.mapToDomain(newResult.dentitionType()));
          existingResult.setPlaque(newResult.plaque());
          existingResult.setCalculus(newResult.calculus());
          existingResult.setGingivitis(newResult.gingivitis());
          existingResult.setParodontitis(newResult.parodontitis());
          existingResult.setDecayRisk(
              StatisticsCalculationHelper.calculateDecayRisk(
                      ExaminationMapper.mapToDomain(newResult.toothDiagnoses()),
                      getAgeOfChildAtExamination(examination))
                  .orElse(null));
          existingResult.setDecayStatus(
              StatisticsCalculationHelper.calculateDecayStatus(
                  ExaminationMapper.mapToDomain(newResult.toothDiagnoses())));
          existingResult.setToothDiagnoses(
              ExaminationMapper.mapToDomain(newResult.toothDiagnoses()));
          existingResult.setIndividualProphylaxis(newResult.individualProphylaxis());
          existingResult.setFissureSealing(newResult.fissureSealing());
          existingResult.setTartarRemoval(newResult.tartarRemoval());
          existingResult.setGingivitisTreatment(newResult.gingivitisTreatment());
          existingResult.setOrthodonticTreatment(newResult.orthodonticTreatment());
          existingResult.setPlaqueTreatment(newResult.plaqueTreatment());
          existingResult.setInspectionAppointment(newResult.inspectionAppointment());
        });
  }

  private int getAgeOfChildAtExamination(Examination examination) {
    List<GetPersonFileStateResponse> personFileStateResponses =
        personClient.fetchPersonDataInBulk(List.of(examination.getChild()));
    if (personFileStateResponses.isEmpty()) {
      throw new IllegalStateException("No person found for examination.");
    }
    GetPersonFileStateResponse fileStateResponse = personFileStateResponses.getFirst();
    return calculateAgeOfChild(examination, fileStateResponse.dateOfBirth());
  }

  public static int calculateAgeOfChild(Examination examination, LocalDate dateOfBirth) {
    LocalDate dateOfExamination =
        examination.getDateAndTime().atZone(ZoneId.systemDefault()).toLocalDate();

    return (int) ChronoUnit.YEARS.between(dateOfBirth, dateOfExamination);
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
    if (existingResult == null
        || existingResult instanceof AbsenceExaminationResult
        || expectedResultClass.equals(AbsenceExaminationResult.class)) {
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

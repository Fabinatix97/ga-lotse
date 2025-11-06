/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.base.centralfile.PersonApi;
import de.eshg.measlesprotection.api.MeaslesVaccinationStatusDto;
import de.eshg.measlesprotection.api.MeaslesVaccinationStatusUpdateModeDto;
import de.eshg.measlesprotection.persistence.db.Person;
import de.eshg.measlesprotection.persistence.db.PersonRepository;
import de.eshg.measlesprotection.persistence.db.SchoolEntryMeaslesVaccinationStatus;
import de.eshg.measlesprotection.polytune.PolytuneMeaslesVaccinationCheckResult;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.schoolentry.api.vaccination.MeaslesVaccinationDto;
import de.eshg.schoolentry.api.vaccination.VaccinationCheckResponse;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import org.springframework.stereotype.Service;

@Service
public class VaccinationCheckService {

  private final PersonApi personApi;
  private final Clock clock;
  private final VaccinationCheckModeProvider vaccinationCheckModeProvider;
  private final SchoolEntryVaccinationCheckClient vaccinationCheckClient;
  private final PolytuneClient polytuneClient;
  private final PersonRepository personRepository;

  public VaccinationCheckService(
      PersonApi personApi,
      Clock clock,
      VaccinationCheckModeProvider vaccinationCheckModeProvider,
      SchoolEntryVaccinationCheckClient vaccinationCheckClient,
      PolytuneClient polytuneClient,
      PersonRepository personRepository) {
    this.personApi = personApi;
    this.clock = clock;
    this.vaccinationCheckModeProvider = vaccinationCheckModeProvider;
    this.vaccinationCheckClient = vaccinationCheckClient;
    this.polytuneClient = polytuneClient;
    this.personRepository = personRepository;
  }

  public MeaslesVaccinationStatusDto checkVaccinationStatus(Person person) {
    return switch (vaccinationCheckModeProvider.vaccinationCheckMode()) {
      case DISABLED -> null;
      case DIRECT ->
          mapToVaccinationStatusDto(
              getVaccinationStatusFromSchoolEntry(
                  getOrCreateMeaslesVaccinationCheckStatus(person), person.getCentralFileStateId()),
              MeaslesVaccinationStatusUpdateModeDto.NONE);
      case POLYTUNE ->
          mapToVaccinationStatusDto(
              getVaccinationStatusViaPolytune(getOrCreateMeaslesVaccinationCheckStatus(person)),
              status ->
                  isUpdatePending(status)
                      ? MeaslesVaccinationStatusUpdateModeDto.PENDING
                      : MeaslesVaccinationStatusUpdateModeDto.POSSIBLE);
    };
  }

  public MeaslesVaccinationStatusDto requestVaccinationStatusUpdate(Person person) {
    return mapToVaccinationStatusDto(
        sendUpdateRequestToPolytune(
            getAssociatedFileStateIds(person.getCentralFileStateId()),
            getOrCreateMeaslesVaccinationCheckStatus(person)),
        MeaslesVaccinationStatusUpdateModeDto.PENDING);
  }

  private SchoolEntryMeaslesVaccinationStatus getVaccinationStatusFromSchoolEntry(
      SchoolEntryMeaslesVaccinationStatus status, UUID fileStateId) {
    return vaccinationCheckClient
        .getMeaslesVaccinationStatus(getAssociatedFileStateIds(fileStateId))
        .map(response -> update(status, response))
        .orElse(status);
  }

  private SchoolEntryMeaslesVaccinationStatus getVaccinationStatusViaPolytune(
      SchoolEntryMeaslesVaccinationStatus status) {
    return Optional.ofNullable(status.getPolytuneRequestId())
        .map(polytuneClient::getResultIfCompleted)
        .flatMap(Function.identity())
        .map(result -> update(status, result))
        .orElse(status);
  }

  private SchoolEntryMeaslesVaccinationStatus update(
      SchoolEntryMeaslesVaccinationStatus databaseStatus, VaccinationCheckResponse response) {
    clearVaccinationFields(databaseStatus);
    databaseStatus.setLastUpdate(Instant.now(clock));
    databaseStatus.setPolytuneRequestId(null);
    if (response.status() != null) {
      databaseStatus.setVaccinationComplete(response.status().complete());
      databaseStatus.setMmr(response.status().mmr());
      databaseStatus.setVaccinationPassPresented(response.status().vaccinationPassPresented());
      databaseStatus.setMeaslesContraIndication(response.status().measlesContraIndication());
      databaseStatus.setMeaslesContraIndicationIsPermanent(
          response.status().measlesContraIndicationIsPermanent());
      databaseStatus.setMeaslesContraIndicationUntil(
          response.status().measlesContraIndicationUntil());
    }
    return databaseStatus;
  }

  private SchoolEntryMeaslesVaccinationStatus update(
      SchoolEntryMeaslesVaccinationStatus databaseStatus,
      PolytuneMeaslesVaccinationCheckResult result) {
    clearVaccinationFields(databaseStatus);
    databaseStatus.setLastUpdate(databaseStatus.getPolytuneRequestTime());
    databaseStatus.setPolytuneRequestId(null);
    databaseStatus.setPolytuneRequestTime(null);
    databaseStatus.setVaccinationComplete(result.match());
    return databaseStatus;
  }

  private List<UUID> getAssociatedFileStateIds(UUID fileStateId) {
    return personApi.getPersonFileStateIdsAssociatedWithFileState(fileStateId).fileStateIds();
  }

  private SchoolEntryMeaslesVaccinationStatus sendUpdateRequestToPolytune(
      List<UUID> fileStateIds, SchoolEntryMeaslesVaccinationStatus status) {
    if (isUpdatePending(status)) {
      throw new BadRequestException("Update not possible");
    }
    status.setPolytuneRequestTime(Instant.now(clock));
    status.setPolytuneRequestId(polytuneClient.requestUpdate(fileStateIds));
    return status;
  }

  private boolean isUpdatePending(SchoolEntryMeaslesVaccinationStatus status) {
    return status.getPolytuneRequestId() != null;
  }

  private SchoolEntryMeaslesVaccinationStatus getOrCreateMeaslesVaccinationCheckStatus(
      Person person) {
    return Optional.ofNullable(person.getMeaslesVaccinationStatus())
        .orElseGet(() -> createMeaslesVaccinationCheckStatus(person));
  }

  private SchoolEntryMeaslesVaccinationStatus createMeaslesVaccinationCheckStatus(Person person) {
    SchoolEntryMeaslesVaccinationStatus schoolEntryMeaslesVaccinationStatus =
        new SchoolEntryMeaslesVaccinationStatus();
    schoolEntryMeaslesVaccinationStatus.setPerson(person);
    person.setMeaslesVaccinationStatus(schoolEntryMeaslesVaccinationStatus);
    personRepository.flush();
    return schoolEntryMeaslesVaccinationStatus;
  }

  private MeaslesVaccinationStatusDto mapToVaccinationStatusDto(
      SchoolEntryMeaslesVaccinationStatus databaseStatus,
      MeaslesVaccinationStatusUpdateModeDto updateMode) {
    return mapToVaccinationStatusDto(databaseStatus, status -> updateMode);
  }

  private MeaslesVaccinationStatusDto mapToVaccinationStatusDto(
      SchoolEntryMeaslesVaccinationStatus databaseStatus,
      Function<SchoolEntryMeaslesVaccinationStatus, MeaslesVaccinationStatusUpdateModeDto>
          updateModeExtractor) {
    return new MeaslesVaccinationStatusDto(
        mapToVaccinationDto(databaseStatus),
        Optional.ofNullable(databaseStatus.getLastUpdate())
            .map(instant -> LocalDateTime.ofInstant(instant, clock.getZone()))
            .orElse(null),
        updateModeExtractor.apply(databaseStatus));
  }

  private static MeaslesVaccinationDto mapToVaccinationDto(
      SchoolEntryMeaslesVaccinationStatus measlesVaccinationStatus) {
    if (measlesVaccinationStatus == null || !hasInformation(measlesVaccinationStatus)) {
      return null;
    } else {
      return new MeaslesVaccinationDto(
          measlesVaccinationStatus.getVaccinationComplete(),
          measlesVaccinationStatus.getMmr(),
          measlesVaccinationStatus.getVaccinationPassPresented(),
          measlesVaccinationStatus.getMeaslesContraIndication(),
          measlesVaccinationStatus.getMeaslesContraIndicationIsPermanent(),
          measlesVaccinationStatus.getMeaslesContraIndicationUntil());
    }
  }

  private static boolean hasInformation(SchoolEntryMeaslesVaccinationStatus vaccinationStatus) {
    return vaccinationStatus.getVaccinationComplete() != null
        || vaccinationStatus.getMmr() != null
        || vaccinationStatus.getVaccinationPassPresented() != null
        || vaccinationStatus.getMeaslesContraIndication() != null
        || vaccinationStatus.getMeaslesContraIndicationIsPermanent() != null
        || vaccinationStatus.getMeaslesContraIndicationUntil() != null;
  }

  private static void clearVaccinationFields(
      SchoolEntryMeaslesVaccinationStatus vaccinationStatus) {
    vaccinationStatus.setVaccinationComplete(null);
    vaccinationStatus.setMmr(null);
    vaccinationStatus.setVaccinationPassPresented(null);
    vaccinationStatus.setMeaslesContraIndication(null);
    vaccinationStatus.setMeaslesContraIndicationIsPermanent(null);
    vaccinationStatus.setMeaslesContraIndicationUntil(null);
  }
}

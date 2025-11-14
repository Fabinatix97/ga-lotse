/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.vaccinationcheck;

import de.eshg.base.centralfile.PersonApi;
import de.eshg.measlesprotection.api.MeaslesVaccinationStatusDto;
import de.eshg.measlesprotection.api.MeaslesVaccinationStatusUpdateModeDto;
import de.eshg.measlesprotection.persistence.db.Person;
import de.eshg.measlesprotection.persistence.db.PersonRepository;
import de.eshg.measlesprotection.persistence.db.SchoolEntryMeaslesVaccinationStatus;
import de.eshg.schoolentry.api.vaccination.MeaslesVaccinationDto;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import org.springframework.stereotype.Component;

@Component
public class VaccinationCheckHelper {

  private final PersonApi personApi;
  private final PersonRepository personRepository;
  private final Clock clock;

  public VaccinationCheckHelper(
      PersonApi personApi, PersonRepository personRepository, Clock clock) {
    this.personApi = personApi;
    this.personRepository = personRepository;
    this.clock = clock;
  }

  public static void clearVaccinationFields(SchoolEntryMeaslesVaccinationStatus vaccinationStatus) {
    vaccinationStatus.setVaccinationComplete(null);
    vaccinationStatus.setMmr(null);
    vaccinationStatus.setVaccinationPassPresented(null);
    vaccinationStatus.setMeaslesContraIndication(null);
    vaccinationStatus.setMeaslesContraIndicationIsPermanent(null);
    vaccinationStatus.setMeaslesContraIndicationUntil(null);
  }

  public List<UUID> getAssociatedFileStateIds(UUID fileStateId) {
    return personApi.getPersonFileStateIdsAssociatedWithFileState(fileStateId).fileStateIds();
  }

  public SchoolEntryMeaslesVaccinationStatus getOrCreateMeaslesVaccinationCheckStatus(
      Person person) {
    return Optional.ofNullable(person.getMeaslesVaccinationStatus())
        .orElseGet(() -> createMeaslesVaccinationCheckStatus(person));
  }

  public MeaslesVaccinationStatusDto mapToVaccinationStatusDto(
      SchoolEntryMeaslesVaccinationStatus databaseStatus,
      MeaslesVaccinationStatusUpdateModeDto updateMode) {
    return mapToVaccinationStatusDto(databaseStatus, status -> updateMode);
  }

  public MeaslesVaccinationStatusDto mapToVaccinationStatusDto(
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

  private SchoolEntryMeaslesVaccinationStatus createMeaslesVaccinationCheckStatus(Person person) {
    SchoolEntryMeaslesVaccinationStatus schoolEntryMeaslesVaccinationStatus =
        new SchoolEntryMeaslesVaccinationStatus();
    schoolEntryMeaslesVaccinationStatus.setPerson(person);
    person.setMeaslesVaccinationStatus(schoolEntryMeaslesVaccinationStatus);
    personRepository.flush();
    return schoolEntryMeaslesVaccinationStatus;
  }
}

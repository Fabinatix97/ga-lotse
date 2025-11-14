/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.vaccinationcheck;

import static de.eshg.measlesprotection.vaccinationcheck.VaccinationCheckHelper.clearVaccinationFields;

import de.eshg.measlesprotection.MeaslesProtectionProperties;
import de.eshg.measlesprotection.api.MeaslesVaccinationStatusDto;
import de.eshg.measlesprotection.api.MeaslesVaccinationStatusUpdateModeDto;
import de.eshg.measlesprotection.persistence.db.Person;
import de.eshg.measlesprotection.persistence.db.SchoolEntryMeaslesVaccinationStatus;
import de.eshg.schoolentry.api.vaccination.VaccinationCheckResponse;
import java.time.Clock;
import java.time.Instant;
import org.springframework.stereotype.Service;

@Service
public class DirectVaccinationCheckService {
  private final VaccinationCheckHelper vaccinationCheckHelper;
  private final SchoolEntryVaccinationCheckClient client;
  private final MeaslesProtectionProperties measlesProtectionProperties;
  private final Clock clock;

  public DirectVaccinationCheckService(
      VaccinationCheckHelper vaccinationCheckHelper,
      SchoolEntryVaccinationCheckClient client,
      MeaslesProtectionProperties measlesProtectionProperties,
      Clock clock) {
    this.vaccinationCheckHelper = vaccinationCheckHelper;
    this.client = client;
    this.measlesProtectionProperties = measlesProtectionProperties;
    this.clock = clock;
  }

  public MeaslesVaccinationStatusDto getVaccinationStatusFromSchoolEntry(Person person) {
    SchoolEntryMeaslesVaccinationStatus status =
        vaccinationCheckHelper.getOrCreateMeaslesVaccinationCheckStatus(person);
    if (cooldownPassed(status)) {
      client
          .getMeaslesVaccinationStatus(
              vaccinationCheckHelper.getAssociatedFileStateIds(person.getCentralFileStateId()))
          .ifPresent(response -> update(status, response));
    }
    return vaccinationCheckHelper.mapToVaccinationStatusDto(
        status, MeaslesVaccinationStatusUpdateModeDto.NONE);
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

  private boolean cooldownPassed(SchoolEntryMeaslesVaccinationStatus status) {
    return (status.getLastUpdate() == null)
        || (status
            .getLastUpdate()
            .plus(measlesProtectionProperties.getDirectVaccinationCheckCooldown())
            .isBefore(Instant.now(clock)));
  }
}

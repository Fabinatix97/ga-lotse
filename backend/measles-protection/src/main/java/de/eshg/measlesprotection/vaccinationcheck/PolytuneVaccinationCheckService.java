/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.vaccinationcheck;

import static de.eshg.measlesprotection.vaccinationcheck.VaccinationCheckHelper.clearVaccinationFields;

import de.eshg.measlesprotection.api.MeaslesVaccinationStatusDto;
import de.eshg.measlesprotection.api.MeaslesVaccinationStatusUpdateModeDto;
import de.eshg.measlesprotection.persistence.db.Person;
import de.eshg.measlesprotection.persistence.db.SchoolEntryMeaslesVaccinationStatus;
import de.eshg.measlesprotection.polytune.PolytuneMeaslesVaccinationCheckResult;
import de.eshg.rest.service.error.BadRequestException;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import org.springframework.stereotype.Service;

@Service
public class PolytuneVaccinationCheckService {

  private final VaccinationCheckHelper vaccinationCheckHelper;
  private final PolytuneClient client;
  private final Clock clock;

  public PolytuneVaccinationCheckService(
      VaccinationCheckHelper vaccinationCheckHelper, PolytuneClient client, Clock clock) {
    this.vaccinationCheckHelper = vaccinationCheckHelper;
    this.client = client;
    this.clock = clock;
  }

  public MeaslesVaccinationStatusDto getVaccinationStatusViaPolytune(Person person) {
    SchoolEntryMeaslesVaccinationStatus status =
        vaccinationCheckHelper.getOrCreateMeaslesVaccinationCheckStatus(person);
    return vaccinationCheckHelper.mapToVaccinationStatusDto(
        Optional.ofNullable(status.getPolytuneRequestId())
            .map(client::getResultIfCompleted)
            .flatMap(Function.identity())
            .map(result -> update(status, result))
            .orElse(status),
        this::toPolytuneUpdateMode);
  }

  public MeaslesVaccinationStatusDto requestVaccinationStatusUpdate(Person person) {
    return vaccinationCheckHelper.mapToVaccinationStatusDto(
        sendUpdateToPolytune(
            vaccinationCheckHelper.getOrCreateMeaslesVaccinationCheckStatus(person),
            vaccinationCheckHelper.getAssociatedFileStateIds(person.getCentralFileStateId())),
        MeaslesVaccinationStatusUpdateModeDto.PENDING);
  }

  private SchoolEntryMeaslesVaccinationStatus sendUpdateToPolytune(
      SchoolEntryMeaslesVaccinationStatus status, List<UUID> fileStateIds) {
    if (isUpdatePending(status)) {
      throw new BadRequestException("Update not possible");
    }
    status.setPolytuneRequestTime(Instant.now(clock));
    status.setPolytuneRequestId(client.requestUpdate(fileStateIds));
    return status;
  }

  private MeaslesVaccinationStatusUpdateModeDto toPolytuneUpdateMode(
      SchoolEntryMeaslesVaccinationStatus status) {
    return isUpdatePending(status)
        ? MeaslesVaccinationStatusUpdateModeDto.PENDING
        : MeaslesVaccinationStatusUpdateModeDto.POSSIBLE;
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

  private boolean isUpdatePending(SchoolEntryMeaslesVaccinationStatus status) {
    return status.getPolytuneRequestId() != null;
  }
}

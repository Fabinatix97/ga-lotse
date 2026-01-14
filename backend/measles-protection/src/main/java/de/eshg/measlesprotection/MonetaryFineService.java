/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.measlesprotection.api.CreateMonetaryFineDto;
import de.eshg.measlesprotection.api.UpdateMonetaryFineDto;
import de.eshg.measlesprotection.config.DateTimeConstants;
import de.eshg.measlesprotection.mapper.MonetaryFineMapper;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.measlesprotection.persistence.db.MonetaryFine;
import de.eshg.measlesprotection.persistence.support.MeaslesProtectionSystemProgressEntryType;
import de.eshg.rest.service.error.NotFoundException;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MonetaryFineService {

  private final ProcedureFinder procedureFinder;

  public MonetaryFineService(ProcedureFinder procedureFinder) {
    this.procedureFinder = procedureFinder;
  }

  @Transactional
  public MonetaryFine createMonetaryFine(UUID procedureId, CreateMonetaryFineDto request) {
    MeaslesProtectionProcedure procedure = procedureFinder.findProcedureByExternalId(procedureId);

    MonetaryFine monetaryFine = MonetaryFineMapper.toDatabaseType(request);
    monetaryFine.setProcedure(procedure);
    procedure.addMonetaryFine(monetaryFine);

    addInitialProgressEntry(procedure, monetaryFine);
    return monetaryFine;
  }

  private void addInitialProgressEntry(
      MeaslesProtectionProcedure procedure, MonetaryFine monetaryFine) {
    SystemProgressEntry initialProgressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            MeaslesProtectionSystemProgressEntryType.MONETARY_FINE_ISSUED.name(),
            createInitialProgressEntryDescription(monetaryFine),
            TriggerType.SYSTEM_AUTOMATIC);
    procedure.addProgressEntry(initialProgressEntry);
  }

  private String createInitialProgressEntryDescription(MonetaryFine monetaryFine) {
    return "Das Bußgeld wurde am %s erteilt."
        .formatted(monetaryFine.getFineIssuedDate().format(DateTimeConstants.DATE_FORMAT_DE));
  }

  @Transactional
  public MonetaryFine updateMonetaryFine(
      UUID procedureId, UUID monetaryFineId, UpdateMonetaryFineDto request) {
    MeaslesProtectionProcedure procedure = procedureFinder.findProcedureByExternalId(procedureId);

    MonetaryFine monetaryFine =
        procedure.getMonetaryFines().stream()
            .filter(mf -> mf.getExternalId().equals(monetaryFineId))
            .findAny()
            .orElseThrow(() -> new NotFoundException("MonetaryFine with given UUID not found"));

    monetaryFine.setFineIssuedDate(request.fineIssuedDate());
    return monetaryFine;
  }
}

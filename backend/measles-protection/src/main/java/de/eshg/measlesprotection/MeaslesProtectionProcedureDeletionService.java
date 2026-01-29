/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.PersonWithoutDateOfBirthApi;
import de.eshg.lib.procedure.cemetery.CemeteryService;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.procedure.procedures.ProcedureDeletionService;
import de.eshg.measlesprotection.persistence.centralfile.PersonClient;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import org.springframework.stereotype.Component;

@Component
public class MeaslesProtectionProcedureDeletionService
    extends ProcedureDeletionService<MeaslesProtectionProcedure> {

  private final PersonWithoutDateOfBirthApi personWithoutDateOfBirthApi;

  public MeaslesProtectionProcedureDeletionService(
      ProcedureRepository<MeaslesProtectionProcedure> procedureRepository,
      CemeteryService cemeteryService,
      PersonApi personApi,
      PersonWithoutDateOfBirthApi personWithoutDateOfBirthApi,
      FacilityApi facilityApi) {
    super(procedureRepository, cemeteryService, personApi, facilityApi);
    this.personWithoutDateOfBirthApi = personWithoutDateOfBirthApi;
  }

  @Override
  protected void markRelatedFileStatesForDeletion(MeaslesProtectionProcedure procedure) {
    PersonClient.deletePersonsWithoutDateOfBirth(
        personWithoutDateOfBirthApi, procedure.getCustodiansWithoutDob());
    super.markRelatedFileStatesForDeletion(procedure);
  }

  @Override
  protected void deleteRelatedFileStatesDuringArchiving(MeaslesProtectionProcedure procedure) {
    PersonClient.deletePersonsWithoutDateOfBirth(
        personWithoutDateOfBirthApi, procedure.getCustodiansWithoutDob());
    super.deleteRelatedFileStatesDuringArchiving(procedure);
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.testhelper;

import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.registry.MedicalRegistryEntryRepository;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.DatabaseResetHelper;
import de.eshg.testhelper.DefaultTestHelperService;
import de.eshg.testhelper.ResettableProperties;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.interception.TestRequestInterceptor;
import de.eshg.testhelper.population.BasePopulator;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@ConditionalOnTestHelperEnabled
@Service
public class MedicalRegistryTestHelperService extends DefaultTestHelperService {

  private final AuditLogger auditLogger;
  private final MedicalRegistryEntryRepository medicalRegistryEntryRepository;

  protected MedicalRegistryTestHelperService(
      DatabaseResetHelper databaseResetHelper,
      TestRequestInterceptor testRequestInterceptor,
      Clock clock,
      List<BasePopulator<?>> populators,
      List<ResettableProperties> resettableProperties,
      EnvironmentConfig environmentConfig,
      AuditLogger auditLogger,
      MedicalRegistryEntryRepository medicalRegistryEntryRepository) {
    super(
        databaseResetHelper,
        testRequestInterceptor,
        clock,
        populators,
        resettableProperties,
        environmentConfig);
    this.auditLogger = auditLogger;
    this.medicalRegistryEntryRepository = medicalRegistryEntryRepository;
  }

  public void closeProcedure(UUID procedureId) {
    MedicalRegistryEntry medicalRegistryEntry =
        medicalRegistryEntryRepository.findByExternalId(procedureId).orElseThrow();
    medicalRegistryEntry.updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);
  }

  public void openProcedure(UUID procedureId) {
    MedicalRegistryEntry medicalRegistryEntry =
        medicalRegistryEntryRepository.findByExternalId(procedureId).orElseThrow();
    medicalRegistryEntry.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
  }
}

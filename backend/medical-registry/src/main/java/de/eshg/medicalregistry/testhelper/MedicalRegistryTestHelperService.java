/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.testhelper;

import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure;
import de.eshg.medicalregistry.domain.repository.MedicalRegistryProcedureRepository;
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
  private final MedicalRegistryProcedureRepository medicalRegistryProcedureRepository;

  protected MedicalRegistryTestHelperService(
      DatabaseResetHelper databaseResetHelper,
      TestRequestInterceptor testRequestInterceptor,
      Clock clock,
      List<BasePopulator<?>> populators,
      List<ResettableProperties> resettableProperties,
      EnvironmentConfig environmentConfig,
      AuditLogger auditLogger,
      MedicalRegistryProcedureRepository medicalRegistryProcedureRepository) {
    super(
        databaseResetHelper,
        testRequestInterceptor,
        clock,
        populators,
        resettableProperties,
        environmentConfig);
    this.auditLogger = auditLogger;
    this.medicalRegistryProcedureRepository = medicalRegistryProcedureRepository;
  }

  public void closeProcedure(UUID procedureId) {
    MedicalRegistryProcedure medicalRegistryProcedure =
        medicalRegistryProcedureRepository.findByExternalId(procedureId).orElseThrow();
    medicalRegistryProcedure.updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);
    medicalRegistryProcedure.setProcedureType(ProcedureType.MEDICAL_REGISTRY_ENTRY);
  }

  public void openProcedure(UUID procedureId) {
    MedicalRegistryProcedure medicalRegistryProcedure =
        medicalRegistryProcedureRepository.findByExternalId(procedureId).orElseThrow();
    medicalRegistryProcedure.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
    medicalRegistryProcedure.setProcedureType(ProcedureType.MEDICAL_REGISTRY_ENTRY);
  }
}

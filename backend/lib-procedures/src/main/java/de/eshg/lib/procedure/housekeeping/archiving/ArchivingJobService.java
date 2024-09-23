/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.housekeeping.archiving;

import static org.springframework.data.jpa.domain.Specification.where;

import de.eshg.lib.procedure.domain.model.ArchivingRelevance;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.procedure.domain.specification.ArchivableProceduresSpecification;
import java.util.Collection;
import java.util.List;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Profile("!test")
public class ArchivingJobService<ProcedureT extends Procedure<ProcedureT, ?, ?, ?>> {

  private final ArchivingProperties archivingProperties;
  private final ProcedureRepository<ProcedureT> procedureRepository;
  private final ArchivableProceduresSpecification<ProcedureT> archivableProceduresSpecification;

  public ArchivingJobService(
      ArchivingProperties archivingProperties,
      ProcedureRepository<ProcedureT> procedureRepository,
      ArchivableProceduresSpecification<ProcedureT> archivableProceduresSpecification) {
    this.archivingProperties = archivingProperties;
    this.procedureRepository = procedureRepository;
    this.archivableProceduresSpecification = archivableProceduresSpecification;
  }

  @Transactional
  public void deleteProcedures(Collection<ProcedureT> procedures) {
    // not implemented
  }

  @Transactional
  public void updateProcedures() {
    List<ProcedureT> proceduresRelevantForUpdate =
        procedureRepository.findAll(
            where(archivableProceduresSpecification)
                .and(archivableProceduresSpecification.procedureHasArchivingRelevanceDefault()));

    for (ProcedureT procedure : proceduresRelevantForUpdate) {
      ArchivingRelevance configuredDefaultRelevance =
          archivingProperties.getDefaultArchivingRelevanceOrElseFallback(
              procedure.getProcedureType());
      procedure.setArchivingRelevance(configuredDefaultRelevance);
    }
  }
}

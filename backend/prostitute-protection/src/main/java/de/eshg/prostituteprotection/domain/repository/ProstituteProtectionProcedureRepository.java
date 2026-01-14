/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.domain.repository;

import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.prostituteprotection.domain.model.EncryptedFile;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface ProstituteProtectionProcedureRepository
    extends ProcedureRepository<ProstituteProtectionProcedure>,
        JpaSpecificationExecutor<ProstituteProtectionProcedure> {

  List<ProstituteProtectionProcedure> findByAppointmentIn(List<Appointment> appointments);

  @Query(
      """
        select p from ProstituteProtectionProcedure p
        where p.procedureStatus
           in (
             de.eshg.lib.procedure.domain.model.ProcedureStatus.OPEN,
             de.eshg.lib.procedure.domain.model.ProcedureStatus.IN_PROGRESS
           )
        and p.appointmentStart < :retentionThreshold
        """)
  List<ProstituteProtectionProcedure> findAllOpenByAppointmentStartBefore(
      Instant retentionThreshold);

  @Query(
      """
        select p from ProstituteProtectionProcedure p
            left join fetch p.consultation c
        where p.appointmentStart < :retentionThreshold and c.predicament is false

    """)
  List<ProstituteProtectionProcedure> findByNoEmergencySituationAndAppointmentStartBefore(
      Instant retentionThreshold);

  @Query(
"""
    select p from ProstituteProtectionProcedure p
    left join fetch p.encryptedFiles
    where p.externalId = :id
""")
  Optional<ProstituteProtectionProcedure> findByExternalIdWithEncryptedFiles(UUID id);

  @Query(
"""
    select ef from EncryptedFile ef
    join ef.procedure p
    where p.externalId = :procedureId
    and ef.externalId = :fileId
""")
  Optional<EncryptedFile> findEncryptedFile(UUID procedureId, UUID fileId);

  List<ProstituteProtectionProcedure> findAllByCalendarEventIdInOrderByCalendarEventId(
      Collection<UUID> calendarEventIds);
}

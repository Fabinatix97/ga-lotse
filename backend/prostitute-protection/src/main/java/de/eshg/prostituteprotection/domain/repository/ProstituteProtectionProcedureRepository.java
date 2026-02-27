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
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface ProstituteProtectionProcedureRepository
    extends ProcedureRepository<ProstituteProtectionProcedure>,
        JpaSpecificationExecutor<ProstituteProtectionProcedure> {

  List<ProstituteProtectionProcedure> findByAppointmentIn(List<Appointment> appointments);

  @Query(
      """
        select p from ProstituteProtectionProcedure p
        left join fetch p.encryptedFiles
        left join fetch p.personalData
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
            left join p.personalData
            left join p.consultation c
            where p.encryptedFiles is not empty
              and not exists(
                select 1
                from EncryptedFile f
                where f.procedure = p and f.validUntil >= :retentionThreshold
                )
              and c.predicament is false
        """)
  List<ProstituteProtectionProcedure> findByNoEmergencySituationAndCertificateExpired(
      LocalDate retentionThreshold);

  @Query(
"""
    select ef from EncryptedFile ef
    join ef.procedure p
    where p.externalId = :procedureId
    and ef.externalId = :fileId
""")
  Optional<EncryptedFile> findEncryptedFile(UUID procedureId, UUID fileId);

  @Transactional
  @Modifying
  @Query("delete from EncryptedFile f where f.procedure.externalId in :procedureIds")
  void deleteEncryptedFiles(List<UUID> procedureIds);

  @Transactional
  @Modifying
  @Query(
      "update ProstituteProtectionProcedure p set p.encryptedPersonalData = null where p.externalId in :procedureIds")
  int clearEncryptedPersonalData(List<UUID> procedureIds);

  @Transactional
  @Modifying
  @Query(
      """
      update PersonalData pd
      set pd.phoneNumber = null,
          pd.residencePermitValidityDate = null,
          pd.customDocumentType = null
      where pd.id in (
          select p.personalData.id
          from ProstituteProtectionProcedure p
          where p.externalId in :procedureIds
          and p.personalData is not null
      )
      """)
  int clearSensitivePersonalDataFields(List<UUID> procedureIds);

  List<ProstituteProtectionProcedure> findAllByCalendarEventIdInOrderByCalendarEventId(
      Collection<UUID> calendarEventIds);

  List<ProstituteProtectionProcedure> findByEncryptedPersonalData_HashedPersonIdentifier(
      byte[] hashedPersonIdentifier);
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.domain.repository;

import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import java.time.Instant;
import java.util.List;
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

  List<ProstituteProtectionProcedure> findByAppointmentStartBefore(Instant retentionThreshold);
}

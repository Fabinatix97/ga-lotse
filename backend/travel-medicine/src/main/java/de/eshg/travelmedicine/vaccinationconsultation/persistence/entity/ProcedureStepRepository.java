/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.persistence.entity;

import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProcedureStepRepository extends JpaRepository<ProcedureStep, UUID> {
  @Query(
      "select ps from ProcedureStep ps where ps.isFollowUp = false and ps.vaccinationConsultation.externalId =:externalId")
  Optional<ProcedureStep> findInitialProcedureStep(@Param("externalId") UUID procedureId);

  List<ProcedureStep> findByAppointmentIn(List<Appointment> appointments);
}

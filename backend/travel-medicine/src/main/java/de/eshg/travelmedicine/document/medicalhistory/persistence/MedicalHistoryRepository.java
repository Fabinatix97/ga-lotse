/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document.medicalhistory.persistence;

import de.eshg.travelmedicine.document.medicalhistory.persistence.entity.MedicalHistory;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MedicalHistoryRepository extends JpaRepository<MedicalHistory, UUID> {
  @Query(
      "select vc from VaccinationConsultation vc inner join vc.procedureSteps ps inner join ps.medicalHistory mh where mh.id = :mh_id")
  Optional<VaccinationConsultation> findProcedureByMedicalHistory(
      @Param("mh_id") UUID medicalHistoryId);
}

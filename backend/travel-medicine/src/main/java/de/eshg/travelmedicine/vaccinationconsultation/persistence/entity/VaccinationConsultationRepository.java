/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.persistence.entity;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VaccinationConsultationRepository
    extends ProcedureRepository<VaccinationConsultation> {

  @Query(
      "select new de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ServicePlanEntry(vc.externalId, s, ps) "
          + "from VcService s inner join fetch s.vaccinationConsultation vc left join fetch s.procedureStep ps "
          + "left join fetch ps.medicalHistory mh left join fetch ps.appointment a left join fetch ps.userDefinedAppointment uda "
          + "where vc.externalId = :externalId order by s.id")
  List<ServicePlanEntry> findServicePlanById(@Param("externalId") UUID externalId);

  @Query(
      """
      select new de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.AppointmentOverviewEntry(vc.externalId, person.centralFileStateId, vc.travelStartDate,
      vc.createdBy, vc.procedureStatus, uda.appointmentStart, uda.cancelled, a.appointmentStart, ps.earliestDate, ps.appointmentType)
      from VaccinationConsultation vc inner join vc.relatedPersons person inner join vc.procedureSteps ps left join ps.appointment a left join ps.userDefinedAppointment uda
      where a.appointmentStart between :startInstant and :endInstant
      or uda.appointmentStart between :startInstant and :endInstant
      or (ps.earliestDate = :startLocalDate and a.appointmentStart is null and uda.appointmentStart is null)
      order by ps.id""")
  List<AppointmentOverviewEntry> findAppointmentOverview(
      @Param("startInstant") Instant startInstant,
      @Param("endInstant") Instant endInstant,
      @Param("startLocalDate") LocalDate startLocalDate);

  @Query(
      "select new de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultationSearch(v.externalId, person.centralFileStateId, v.travelStartDate, "
          + "v.procedureStatus, v.createdBy) from VaccinationConsultation v inner join v.relatedPersons person where v.procedureStatus in (:statusList) order by v.id")
  List<VaccinationConsultationSearch> findAllByProcedureStatusIn(
      @Param("statusList") Iterable<ProcedureStatus> statusList, Pageable pageable);

  Optional<VaccinationConsultation> getByCitizenUserId(UUID citizenUserId);
}

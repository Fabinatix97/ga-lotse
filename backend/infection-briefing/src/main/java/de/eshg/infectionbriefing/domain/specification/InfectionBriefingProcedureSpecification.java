/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.domain.specification;

import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure_;
import de.eshg.infectionbriefing.domain.model.InstructionType;
import de.eshg.infectionbriefing.domain.model.NewCertificateProcedure;
import de.eshg.infectionbriefing.domain.model.NewCertificateProcedure_;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment_;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.io.Serial;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Year;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public class InfectionBriefingProcedureSpecification
    implements Specification<InfectionBriefingProcedure> {

  @Serial private static final long serialVersionUID = 1L;

  private final Instant startOfAppointmentDay;
  private final InstructionType instructionType;
  private final Year instructionYear;
  private final LinkedHashSet<ProcedureStatus> status;

  public InfectionBriefingProcedureSpecification(
      Instant startOfAppointmentDay,
      InstructionType instructionType,
      Year instructionYear,
      LinkedHashSet<ProcedureStatus> status) {
    this.startOfAppointmentDay = startOfAppointmentDay;
    this.instructionType = instructionType;
    this.instructionYear = instructionYear;
    this.status = status;
  }

  @Override
  public Predicate toPredicate(
      Root<InfectionBriefingProcedure> root,
      CriteriaQuery<?> query,
      CriteriaBuilder criteriaBuilder) {
    List<Predicate> conjunctions = new ArrayList<>();

    if (status != null && !status.isEmpty()) {
      conjunctions.add(root.get(InfectionBriefingProcedure_.procedureStatus).in(status));
    }
    if (startOfAppointmentDay != null) {
      conjunctions.add(
          criteriaBuilder.greaterThanOrEqualTo(
              root.join(InfectionBriefingProcedure_.appointment).get(Appointment_.appointmentStart),
              startOfAppointmentDay));
      conjunctions.add(
          criteriaBuilder.lessThan(
              root.join(InfectionBriefingProcedure_.appointment).get(Appointment_.appointmentStart),
              startOfAppointmentDay.plus(1, ChronoUnit.DAYS)));
    }
    if (instructionType != null || instructionYear != null) {
      Root<NewCertificateProcedure> newCertificateProcedureRoot =
          criteriaBuilder.treat(root, NewCertificateProcedure.class);
      if (instructionType != null) {
        conjunctions.add(
            criteriaBuilder.equal(
                newCertificateProcedureRoot.get(NewCertificateProcedure_.instructionType),
                instructionType));
      }
      if (instructionYear != null) {
        LocalDate startOfYear = instructionYear.atDay(1);
        LocalDate endOfYear = instructionYear.plusYears(1).atDay(1).minusDays(1);
        conjunctions.add(
            criteriaBuilder.between(
                newCertificateProcedureRoot.get(NewCertificateProcedure_.instructionDate),
                startOfYear,
                endOfYear));
      }
    }
    return criteriaBuilder.and(conjunctions.toArray(Predicate[]::new));
  }
}

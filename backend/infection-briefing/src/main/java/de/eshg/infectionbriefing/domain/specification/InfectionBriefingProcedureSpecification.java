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
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public class InfectionBriefingProcedureSpecification
    implements Specification<InfectionBriefingProcedure> {

  @Serial private static final long serialVersionUID = 1L;

  private final ArrayList<ProcedureStatus> procedureStatuus;
  private final Instant startOfAppointmentDay;
  private final InstructionType instructionType;

  public InfectionBriefingProcedureSpecification(
      ArrayList<ProcedureStatus> procedureStatuus,
      Instant startOfAppointmentDay,
      InstructionType instructionType) {
    this.procedureStatuus = procedureStatuus;
    this.startOfAppointmentDay = startOfAppointmentDay;
    this.instructionType = instructionType;
  }

  @Override
  public Predicate toPredicate(
      Root<InfectionBriefingProcedure> root,
      CriteriaQuery<?> query,
      CriteriaBuilder criteriaBuilder) {
    List<Predicate> conjunctions = new ArrayList<>();

    if (procedureStatuus != null && !procedureStatuus.isEmpty()) {
      conjunctions.add(root.get(InfectionBriefingProcedure_.procedureStatus).in(procedureStatuus));
    }
    if (startOfAppointmentDay != null) {
      conjunctions.add(
          criteriaBuilder.between(
              root.join(InfectionBriefingProcedure_.appointment).get(Appointment_.appointmentStart),
              startOfAppointmentDay,
              startOfAppointmentDay.plus(1, ChronoUnit.DAYS)));
    }
    if (instructionType != null) {
      Root<NewCertificateProcedure> newCertificateProcedureRoot =
          criteriaBuilder.treat(root, NewCertificateProcedure.class);
      conjunctions.add(
          criteriaBuilder.equal(
              newCertificateProcedureRoot.get(NewCertificateProcedure_.instructionType),
              instructionType));
    }
    return criteriaBuilder.and(conjunctions.toArray(Predicate[]::new));
  }
}

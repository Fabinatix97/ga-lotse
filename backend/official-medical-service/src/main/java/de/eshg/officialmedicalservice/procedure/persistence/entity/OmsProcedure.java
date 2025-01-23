/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.persistence.entity;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.officialmedicalservice.appointment.persistence.entity.OmsAppointment;
import de.eshg.officialmedicalservice.appointment.persistence.entity.OmsAppointment_;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Transient;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.hibernate.annotations.BatchSize;

@Entity
public class OmsProcedure extends Procedure<OmsProcedure, OmsTask, Person, Facility> {
  @OneToMany(
      mappedBy = OmsAppointment_.PROCEDURE,
      cascade = {CascadeType.REMOVE})
  @OrderBy
  @BatchSize(size = 100)
  @DataSensitivity(SensitivityLevel.UNDEFINED)
  private final List<OmsAppointment> appointments = new ArrayList<>();

  @OneToOne(
      fetch = FetchType.LAZY,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  Concern concern;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column
  private UUID physicianId;

  public Person findAffectedPerson() {
    if (getRelatedPersons().isEmpty()) {
      return null;
    }
    return getRelatedPersons().getFirst();
  }

  @Transient
  public Optional<Facility> getFacility() {
    return getRelatedFacilities().stream().collect(StreamUtil.toSingleOptionalElement());
  }

  public Concern getConcern() {
    return concern;
  }

  public void setConcern(Concern concern) {
    this.concern = concern;
  }

  public UUID getPhysicianId() {
    return physicianId;
  }

  public void setPhysicianId(UUID physicianId) {
    this.physicianId = physicianId;
  }

  public List<OmsAppointment> getAppointments() {
    return appointments;
  }
}

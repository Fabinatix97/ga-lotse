/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.domain.model;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.appointmentblock.EntityWithAppointment;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.TriggerType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.OneToOne;
import java.util.UUID;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class InfectionBriefingProcedure
    extends Procedure<
        InfectionBriefingProcedure,
        InfectionBriefingTask,
        InfectionBriefingPerson,
        InfectionBriefingFacility>
    implements EntityWithAppointment {

  protected InfectionBriefingProcedure() {
    super();
  }

  protected InfectionBriefingProcedure(TriggerType triggerType) {
    super(triggerType);
  }

  public InfectionBriefingPerson getApplicant() {
    return getRelatedPersons().stream().collect(StreamUtil.toSingleElement());
  }

  @OneToOne(orphanRemoval = true, cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  @DataSensitivity(SensitivityLevel.PROTECTED)
  private Appointment appointment;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID citizenUserId;

  @Override
  public Appointment getAppointment() {
    return appointment;
  }

  @Override
  public void setAppointment(Appointment appointment) {
    this.appointment = appointment;
  }

  public UUID getCitizenUserId() {
    return citizenUserId;
  }

  public void setCitizenUserId(UUID citizenUserId) {
    this.citizenUserId = citizenUserId;
  }
}

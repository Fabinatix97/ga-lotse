/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.persistence.entity;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.OrderColumn;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.hibernate.annotations.BatchSize;

@Entity
@DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
public class AppointmentBlockGroup extends BaseEntityWithExternalId {
  @OneToMany(
      mappedBy = AppointmentTypeHolder_.APPOINTMENT_BLOCK_GROUP,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @OrderBy
  private final List<AppointmentTypeHolder> appointmentTypeHolders = new ArrayList<>();

  private int parallelExaminations;

  @ElementCollection
  @Column(name = "physician_id", nullable = false)
  @OrderColumn
  private List<UUID> physicians;

  @ElementCollection
  @Column(name = "mfa_id", nullable = false)
  @OrderColumn
  private List<UUID> mfas;

  @ElementCollection
  @Column(name = "consultant_id", nullable = false)
  @OrderColumn
  private List<UUID> consultants;

  private UUID locationId;

  @OneToMany(
      mappedBy = AppointmentBlock_.APPOINTMENT_BLOCK_GROUP,
      cascade = {CascadeType.PERSIST},
      orphanRemoval = true)
  @OrderBy
  @BatchSize(size = 100)
  private final Set<AppointmentBlock> appointmentBlocks = new LinkedHashSet<>();

  public List<AppointmentTypeHolder> getAppointmentTypeHolders() {
    return appointmentTypeHolders;
  }

  public void setAppointmentTypeHolders(List<AppointmentTypeHolder> appointmentTypeHolders) {
    appointmentTypeHolders.forEach(
        appointmentTypeHolder -> appointmentTypeHolder.setAppointmentBlockGroup(this));

    this.appointmentTypeHolders.clear();
    this.appointmentTypeHolders.addAll(appointmentTypeHolders);
  }

  public AppointmentType getType() {
    return appointmentTypeHolders.stream().findFirst().orElseThrow().getType();
  }

  public Duration getSlotDuration() {
    return appointmentTypeHolders.stream().findFirst().orElseThrow().getSlotDuration();
  }

  public int getParallelExaminations() {
    return parallelExaminations;
  }

  public void setParallelExaminations(int parallelExaminations) {
    this.parallelExaminations = parallelExaminations;
  }

  public List<UUID> getPhysicians() {
    return physicians;
  }

  public void setPhysicians(List<UUID> physicians) {
    this.physicians = physicians;
  }

  public List<UUID> getMfas() {
    return mfas;
  }

  public void setMfas(List<UUID> mfas) {
    this.mfas = mfas;
  }

  public List<UUID> getConsultants() {
    return consultants;
  }

  public void setConsultants(List<UUID> consultants) {
    this.consultants = consultants;
  }

  public UUID getLocationId() {
    return locationId;
  }

  public void setLocationId(UUID locationId) {
    this.locationId = locationId;
  }

  public Set<AppointmentBlock> getAppointmentBlocks() {
    return appointmentBlocks;
  }

  public void addAppointmentBlock(AppointmentBlock appointmentBlock) {
    getAppointmentBlocks().add(appointmentBlock);
    appointmentBlock.setAppointmentBlockGroup(this);
  }
}

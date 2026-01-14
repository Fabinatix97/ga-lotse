/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.persistence.entity;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.UUID;
import java.util.stream.Collectors;
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

  private UUID creatorId;

  private UUID locationId;

  @OneToMany(
      mappedBy = AppointmentBlock_.APPOINTMENT_BLOCK_GROUP,
      cascade = {CascadeType.PERSIST},
      orphanRemoval = true)
  @OrderBy
  @BatchSize(size = 100)
  private final Set<AppointmentBlock> appointmentBlocks = new LinkedHashSet<>();

  private Boolean availableForCitizen;

  private Boolean availableForBulkBooking;

  @NotNull private boolean extraLength = false;

  public Boolean isAvailableForBulkBooking() {
    return availableForBulkBooking;
  }

  public void setAvailableForBulkBooking(Boolean availableForBulkBooking) {
    this.availableForBulkBooking = availableForBulkBooking;
  }

  public Boolean isAvailableForCitizen() {
    return availableForCitizen;
  }

  public void setAvailableForCitizen(Boolean availableForCitizen) {
    this.availableForCitizen = availableForCitizen;
  }

  public List<AppointmentTypeHolder> getAppointmentTypeHolders() {
    return appointmentTypeHolders;
  }

  public void setAppointmentTypeHolders(List<AppointmentTypeHolder> appointmentTypeHolders) {
    appointmentTypeHolders.forEach(
        appointmentTypeHolder -> appointmentTypeHolder.setAppointmentBlockGroup(this));

    this.appointmentTypeHolders.clear();
    this.appointmentTypeHolders.addAll(appointmentTypeHolders);
  }

  public Set<AppointmentType> getTypes() {
    return appointmentTypeHolders.stream()
        .map(AppointmentTypeHolder::getType)
        .collect(Collectors.toCollection(TreeSet::new));
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

  public UUID getCreatorId() {
    return creatorId;
  }

  public void setCreatorId(UUID userId) {
    this.creatorId = userId;
  }

  public boolean isExtraLength() {
    return extraLength;
  }

  public void setExtraLength(boolean extraLength) {
    this.extraLength = extraLength;
  }
}

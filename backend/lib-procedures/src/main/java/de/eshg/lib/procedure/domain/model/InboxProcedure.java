/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import static de.eshg.lib.procedure.domain.model.InboxProcedureStatus.CLOSED;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import java.time.Clock;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class InboxProcedure extends BaseEntityWithExternalId {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private InboxProcedureStatus inboxProcedureStatus;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private ProcedureType procedureType;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  @CreatedDate
  private Instant createdAt;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @CreatedBy
  @Column(nullable = false)
  private UUID createdBy;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column
  private Instant closedAt;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(
      optional = false,
      cascade = CascadeType.PERSIST,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private ContactDetails contactDetails;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(
      optional = false,
      cascade = CascadeType.PERSIST,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private InboxProgressEntry inboxProgressEntry;

  public InboxProcedureStatus getInboxProcedureStatus() {
    return inboxProcedureStatus;
  }

  public void updateInboxProcedureStatus(InboxProcedureStatus newStatus, Clock clock) {
    if (newStatus == CLOSED) {
      if (this.inboxProcedureStatus != CLOSED) {
        this.closedAt = Instant.now(clock);
      }
    } else {
      this.closedAt = null;
    }
    this.inboxProcedureStatus = newStatus;
  }

  public ProcedureType getProcedureType() {
    return procedureType;
  }

  public void setProcedureType(ProcedureType procedureType) {
    this.procedureType = procedureType;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public UUID getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(UUID createdBy) {
    this.createdBy = createdBy;
  }

  public Instant getClosedAt() {
    return closedAt;
  }

  public ContactDetails getContactDetails() {
    return contactDetails;
  }

  public void setContactDetails(ContactDetails contactDetails) {
    this.contactDetails = contactDetails;
  }

  public void addContactDetails(ContactDetails contactDetails) {
    setContactDetails(contactDetails);
    contactDetails.setInboxProcedure(this);
  }

  public InboxProgressEntry getInboxProgressEntry() {
    return inboxProgressEntry;
  }

  public void setInboxProgressEntry(InboxProgressEntry inboxProgressEntry) {
    this.inboxProgressEntry = inboxProgressEntry;
  }

  public void addInboxProgressEntry(InboxProgressEntry inboxProgressEntry) {
    setInboxProgressEntry(inboxProgressEntry);
    inboxProgressEntry.setInboxProcedure(this);
  }
}

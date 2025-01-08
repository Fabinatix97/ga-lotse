/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog.domain.model;

import static de.eshg.lib.common.SensitivityLevel.*;

import de.eshg.auditlog.AuditLogSource;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class GrantedAccess extends BaseEntity {

  @Column(nullable = false)
  @DataSensitivity(PUBLIC)
  private LocalDate date;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(PUBLIC)
  private AuditLogSource auditLogSource;

  @Column(nullable = false)
  @DataSensitivity(PUBLIC)
  private Instant expiresAt;

  @Column(nullable = false)
  @DataSensitivity(SENSITIVE)
  private UUID idOfGrantedUser;

  protected GrantedAccess() {}

  public GrantedAccess(
      LocalDate date, AuditLogSource auditLogSource, Instant expiresAt, UUID idOfGrantedUser) {
    this.date = date;
    this.auditLogSource = auditLogSource;
    this.expiresAt = expiresAt;
    this.idOfGrantedUser = idOfGrantedUser;
  }

  public LocalDate getDate() {
    return date;
  }

  public void setDate(LocalDate date) {
    this.date = date;
  }

  public AuditLogSource getAuditLogSource() {
    return auditLogSource;
  }

  public void setAuditLogSource(AuditLogSource auditLogSource) {
    this.auditLogSource = auditLogSource;
  }

  public Instant getExpiresAt() {
    return expiresAt;
  }

  public void setExpiresAt(Instant expiresAt) {
    this.expiresAt = expiresAt;
  }

  public UUID getIdOfGrantedUser() {
    return idOfGrantedUser;
  }

  public void setIdOfGrantedUser(UUID idOfGrantedUser) {
    this.idOfGrantedUser = idOfGrantedUser;
  }
}

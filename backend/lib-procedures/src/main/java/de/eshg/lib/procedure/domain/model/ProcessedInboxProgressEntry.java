/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedBy;

@Entity
public class ProcessedInboxProgressEntry extends ProgressEntry implements FileAware {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(optional = false)
  private InboxProcedure inboxProcedure;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private InboxProgressEntryType inboxProgressEntryType;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String subject;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String messageText;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @CreatedBy
  @Column(nullable = false)
  private UUID createdBy;

  public InboxProcedure getInboxProcedure() {
    return inboxProcedure;
  }

  public void setInboxProcedure(InboxProcedure inboxProcedure) {
    this.inboxProcedure = inboxProcedure;
  }

  public InboxProgressEntryType getInboxProgressEntryType() {
    return inboxProgressEntryType;
  }

  public void setInboxProgressEntryType(InboxProgressEntryType inboxProgressEntryType) {
    this.inboxProgressEntryType = inboxProgressEntryType;
  }

  @Override
  public String getSubject() {
    return subject;
  }

  @Override
  public void setSubject(String subject) {
    this.subject = subject;
  }

  @Override
  public String getMessageText() {
    return messageText;
  }

  @Override
  public void setMessageText(String messageText) {
    this.messageText = messageText;
  }

  @Override
  public boolean supportsUpload(FileType fileType) {
    return false;
  }

  @Override
  public UUID getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(UUID createdBy) {
    this.createdBy = createdBy;
  }
}

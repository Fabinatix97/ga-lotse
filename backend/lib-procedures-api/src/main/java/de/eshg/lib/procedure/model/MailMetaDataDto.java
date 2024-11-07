/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

@Schema(name = MailMetaDataDto.SCHEMA_NAME)
@JsonTypeName(MailMetaDataDto.SCHEMA_NAME)
public final class MailMetaDataDto extends MetaDataDto {

  public static final String SCHEMA_NAME = "MailMetaData";

  private @NotNull String subject;
  private @NotNull String messageText;
  private @NotNull String mailFrom;
  private @NotNull String mailTo;
  private @NotNull Instant sentDate;

  public String getMailFrom() {
    return mailFrom;
  }

  public void setMailFrom(String mailFrom) {
    this.mailFrom = mailFrom;
  }

  public String getMailTo() {
    return mailTo;
  }

  public void setMailTo(String mailTo) {
    this.mailTo = mailTo;
  }

  public Instant getSentDate() {
    return sentDate;
  }

  public void setSentDate(Instant sentDate) {
    this.sentDate = sentDate;
  }

  public @NotNull String getSubject() {
    return subject;
  }

  public void setSubject(@NotNull String subject) {
    this.subject = subject;
  }

  public @NotNull String getMessageText() {
    return messageText;
  }

  public void setMessageText(@NotNull String messageText) {
    this.messageText = messageText;
  }
}

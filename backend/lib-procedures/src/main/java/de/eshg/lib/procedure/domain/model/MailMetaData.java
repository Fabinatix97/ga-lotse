/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import java.time.Instant;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;

@Entity
@Audited
public class MailMetaData extends MetaData {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(optional = false)
  @MapsId
  @NotAudited
  private Mail mail;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Column(nullable = false)
  private String mailFrom;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Column(nullable = false)
  private String mailTo;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private Instant sentDate;

  public String getMailFrom() {
    return mailFrom;
  }

  public String getMailTo() {
    return mailTo;
  }

  public Instant getSentDate() {
    return sentDate;
  }

  public void setMail(Mail mail) {
    this.mail = mail;
  }

  public void setMailFrom(String mailFrom) {
    this.mailFrom = mailFrom;
  }

  public void setMailTo(String mailTo) {
    this.mailTo = mailTo;
  }

  public void setSentDate(Instant sentDate) {
    this.sentDate = sentDate;
  }
}

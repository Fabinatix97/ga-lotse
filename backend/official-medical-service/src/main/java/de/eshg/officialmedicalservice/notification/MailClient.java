/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.notification;

import de.eshg.base.mail.MailApi;
import de.eshg.base.mail.MailType;
import de.eshg.base.mail.SendEmailRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class MailClient {
  private static final Logger log = LoggerFactory.getLogger(MailClient.class);

  private final MailApi mailApi;

  public MailClient(MailApi mailApi) {
    this.mailApi = mailApi;
  }

  void sendMail(String to, String from, String subject, String text, MailType mailType) {
    log.info("Sending E-Mail notification");

    SendEmailRequest sendEmailRequest = new SendEmailRequest(to, from, subject, text, mailType);
    mailApi.sendEmail(sendEmailRequest);

    log.info("E-Mail notification sent");
  }
}

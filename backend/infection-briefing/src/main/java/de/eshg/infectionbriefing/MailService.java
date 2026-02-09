/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import de.eshg.base.mail.MailApi;
import de.eshg.base.mail.MailType;
import de.eshg.base.mail.SendEmailRequest;
import de.eshg.config.departmentinfo.DepartmentInfoConfigService;
import de.eshg.infectionbriefing.config.InfectionBriefingProperties;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
public class MailService {
  private static final Logger log = LoggerFactory.getLogger(MailService.class);

  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final Clock clock;

  private static final DateTimeFormatter dateFormatter =
      DateTimeFormatter.ofPattern("dd. MMMM yyyy", Locale.GERMAN);

  private static final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm");

  private final MailApi mailApi;
  private final InfectionBriefingProperties properties;
  private final DepartmentInfoConfigService departmentInfoConfigService;

  public MailService(
      ModuleClientAuthenticator moduleClientAuthenticator,
      Clock clock,
      MailApi mailApi,
      InfectionBriefingProperties properties,
      DepartmentInfoConfigService departmentInfoConfigService) {
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.clock = clock;
    this.mailApi = mailApi;
    this.properties = properties;
    this.departmentInfoConfigService = departmentInfoConfigService;
  }

  public void sendAppointmentConfirmationMail(Instant appointmentStart, String recipientEmail) {
    sendMail(
        recipientEmail,
        departmentInfoConfigService.getDepartmentInfo().email(),
        properties.getNewCertificateAppointmentConfirmationMail().getSubject(),
        getContentAsString(properties.getNewCertificateAppointmentConfirmationMail().getBody())
            .formatted(
                appointmentStart.atZone(clock.getZone()).toLocalDateTime().format(dateFormatter),
                appointmentStart.atZone(clock.getZone()).toLocalTime().format(timeFormatter)));
  }

  private void sendMail(String to, String from, String subject, String text) {
    moduleClientAuthenticator.doWithModuleClientAuthentication(
        () -> {
          log.info("Sending confirmation e-mail");
          mailApi.sendEmail(new SendEmailRequest(to, from, subject, text, MailType.PLAIN_TEXT));
          log.info("Confirmation e-mail sent");
        });
  }

  private String getContentAsString(Resource resource) {
    try {
      return resource.getContentAsString(StandardCharsets.UTF_8);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }
}

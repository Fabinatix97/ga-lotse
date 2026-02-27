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
import de.eshg.infectionbriefing.config.InfectionBriefingProperties.Mail;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class MailService {

  private static final Logger log = LoggerFactory.getLogger(MailService.class);
  private static final String CITIZEN_PORTAL_INFECTION_BRIEFING_LOGIN_PATH =
      "lebensmittelausweis/meine-termine";

  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final Clock clock;
  private final String citizenPortalUrl;

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
      DepartmentInfoConfigService departmentInfoConfigService,
      @Value("${eshg.citizen-portal.reverse-proxy.url}") String citizenPortalUrl) {
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.clock = clock;
    this.mailApi = mailApi;
    this.properties = properties;
    this.departmentInfoConfigService = departmentInfoConfigService;
    this.citizenPortalUrl = citizenPortalUrl;
  }

  public void sendNewCertificateAppointmentConfirmationMail(
      Instant appointmentStart, String recipientEmail, String accessCode) {
    sendMail(
        recipientEmail,
        departmentInfoConfigService.getDepartmentInfo().email(),
        properties.getNewCertificateAppointmentConfirmationMail().getSubject(),
        readTemplateBody(properties.getNewCertificateAppointmentConfirmationMail().getBody())
            .formatted(
                appointmentStart.atZone(clock.getZone()).toLocalDateTime().format(dateFormatter),
                appointmentStart.atZone(clock.getZone()).toLocalTime().format(timeFormatter),
                buildLoginUrl(accessCode),
                accessCode));
  }

  public void sendReplacementCertificateAppointmentConfirmationMail(
      Instant appointmentStart, String recipientEmail, String accessCode) {
    sendMail(
        recipientEmail,
        departmentInfoConfigService.getDepartmentInfo().email(),
        properties.getReplacementCertificateAppointmentConfirmationMail().getSubject(),
        readTemplateBody(
                properties.getReplacementCertificateAppointmentConfirmationMail().getBody())
            .formatted(
                appointmentStart.atZone(clock.getZone()).toLocalDateTime().format(dateFormatter),
                appointmentStart.atZone(clock.getZone()).toLocalTime().format(timeFormatter),
                buildLoginUrl(accessCode),
                accessCode));
  }

  public void sendCancelAppointmentConfirmationMail(
      String recipientEmail, Appointment appointment) {
    Mail template = getCancellationMailTemplate(appointment);
    sendMail(
        recipientEmail,
        departmentInfoConfigService.getDepartmentInfo().email(),
        template.getSubject(),
        readTemplateBody(template.getBody())
            .formatted(
                appointment
                    .getAppointmentStart()
                    .atZone(clock.getZone())
                    .toLocalDateTime()
                    .format(dateFormatter),
                appointment
                    .getAppointmentStart()
                    .atZone(clock.getZone())
                    .toLocalTime()
                    .format(timeFormatter)));
  }

  private Mail getCancellationMailTemplate(Appointment appointment) {
    return switch (appointment.getType()) {
      case INFECTION_BRIEFING_NEW ->
          properties.getCancelNewCertificateAppointmentConfirmationMail();
      case INFECTION_BRIEFING_REPLACEMENT ->
          properties.getCancelReplacementCertificateAppointmentConfirmationMail();
      default ->
          throw new IllegalArgumentException(
              "Unsupported appointment type %s".formatted(appointment.getType()));
    };
  }

  private void sendMail(String to, String from, String subject, String body) {
    moduleClientAuthenticator.doWithPotentiallyReplacedModuleClientAuthenticator(
        () -> {
          log.info("Sending confirmation e-mail");
          mailApi.sendEmail(new SendEmailRequest(to, from, subject, body, MailType.PLAIN_TEXT));
          log.info("Confirmation e-mail sent");
        });
  }

  private static String readTemplateBody(Resource bodyTemplateResource) {
    try (Reader reader =
        new InputStreamReader(bodyTemplateResource.getInputStream(), StandardCharsets.UTF_8)) {
      return FileCopyUtils.copyToString(reader);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  private String buildLoginUrl(String accessCode) {
    return UriComponentsBuilder.fromUriString(citizenPortalUrl)
        .pathSegment(CITIZEN_PORTAL_INFECTION_BRIEFING_LOGIN_PATH)
        .queryParam("access_code", accessCode)
        .build()
        .toUriString();
  }
}

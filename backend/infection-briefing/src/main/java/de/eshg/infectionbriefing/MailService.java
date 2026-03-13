/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.infectionbriefing.api.InfectionBriefingAppointTypeDto.INFECTION_BRIEFING_REPLACEMENT;

import de.eshg.base.mail.MailApi;
import de.eshg.base.mail.MailType;
import de.eshg.base.mail.SendEmailRequest;
import de.eshg.config.departmentinfo.DepartmentInfoConfigService;
import de.eshg.infectionbriefing.config.InfectionBriefingProperties;
import de.eshg.infectionbriefing.config.InfectionBriefingProperties.Mail;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.procedure.domain.model.TriggerType;
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

  public boolean sendAppointmentConfirmationMail(
      String recipientEmail,
      AppointmentType appointmentType,
      TriggerType triggerType,
      Instant startTime,
      String accessCode) {
    Mail template = getConfirmationMailTemplate(appointmentType, triggerType);
    try {
      sendMail(
          recipientEmail,
          departmentInfoConfigService.getDepartmentInfo().email(),
          template.getSubject(),
          readTemplateBody(template.getBody())
              .formatted(
                  dateStringOf(startTime),
                  timeStringOf(startTime),
                  buildLoginUrl(accessCode),
                  accessCode));
      return true;
    } catch (Exception e) {
      log.warn("Cannot send confirmation e-mail", e);
      return false;
    }
  }

  public void sendCancelAppointmentConfirmationMail(
      String recipientEmail, AppointmentType appointmentType, Instant startTime) {
    Mail template = getCancellationMailTemplate(appointmentType);
    sendMail(
        recipientEmail,
        departmentInfoConfigService.getDepartmentInfo().email(),
        template.getSubject(),
        readTemplateBody(template.getBody())
            .formatted(dateStringOf(startTime), timeStringOf(startTime)));
  }

  private Mail getConfirmationMailTemplate(
      AppointmentType appointmentType, TriggerType triggerType) {
    return switch (appointmentType) {
      case INFECTION_BRIEFING_NEW ->
          switch (triggerType) {
            case CITIZEN -> properties.getNewCertificateAppointmentConfirmationMail();
            case EMPLOYEE -> properties.getNewCertificateAppointmentByEmployeeConfirmationMail();
            default -> throw new IllegalArgumentException("Unsupported triggerType " + triggerType);
          };
      case INFECTION_BRIEFING_REPLACEMENT ->
          switch (triggerType) {
            case CITIZEN -> properties.getReplacementCertificateAppointmentConfirmationMail();
            case EMPLOYEE ->
                properties.getReplacementCertificateAppointmentByEmployeeConfirmationMail();
            default -> throw new IllegalArgumentException("Unsupported triggerType " + triggerType);
          };
      default ->
          throw new IllegalArgumentException("Unsupported appointment type " + appointmentType);
    };
  }

  private Mail getCancellationMailTemplate(AppointmentType appointmentType) {
    return switch (appointmentType) {
      case INFECTION_BRIEFING_NEW ->
          properties.getCancelNewCertificateAppointmentConfirmationMail();
      case INFECTION_BRIEFING_REPLACEMENT ->
          properties.getCancelReplacementCertificateAppointmentConfirmationMail();
      default ->
          throw new IllegalArgumentException(
              "Unsupported appointment type %s".formatted(appointmentType));
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

  private String dateStringOf(Instant time) {
    return time.atZone(clock.getZone()).toLocalDateTime().format(dateFormatter);
  }

  private String timeStringOf(Instant time) {
    return time.atZone(clock.getZone()).toLocalDateTime().format(timeFormatter);
  }

  private String buildLoginUrl(String accessCode) {
    return UriComponentsBuilder.fromUriString(citizenPortalUrl)
        .pathSegment(CITIZEN_PORTAL_INFECTION_BRIEFING_LOGIN_PATH)
        .queryParam("access_code", accessCode)
        .build()
        .toUriString();
  }
}

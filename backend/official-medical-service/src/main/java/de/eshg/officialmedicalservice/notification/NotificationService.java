/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.notification;

import static de.eshg.base.mail.MailType.HTML;
import static de.eshg.base.mail.MailType.PLAIN_TEXT;

import de.eshg.base.mail.MailType;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.officialmedicalservice.procedure.api.AffectedPersonDto;
import java.util.List;
import java.util.function.IntSupplier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class NotificationService {

  private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

  private static final String NOTIFICATION_IS_DISABLED =
      "Für diesen Vorgang ist der Mailversand deaktiviert.";
  private static final String MISSING_ADDRESSES =
      "Für diese Person sind keine Mailadressen erfasst.";

  public record NotificationSummary(String subject, int numSentMails, String notSentBecause) {
    @Override
    public String toString() {
      return "Benachrichtigung mit Betreff '"
          + subject
          + "': "
          + (notSentBecause == null
              ? "gesendet an " + numSentMails + " Mailadresse(n)"
              : "nicht versendet: " + notSentBecause);
    }
  }

  private static final String CITIZEN_PORTAL_OMS_LOGIN_PATH =
      "amtsärztlichegutachten/allesnurgeraten/meine-termine";

  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final MailClient mailClient;
  private final NotificationProperties notificationProperties;
  private final NotificationText notificationText;
  private final String citizenPortalUrl;
  private final SecurityContextHolderStrategy securityContextHolderStrategy =
      SecurityContextHolder.getContextHolderStrategy();

  @FunctionalInterface
  public interface MailEnabledProvider {
    boolean isSendEmailNotifications();
  }

  public NotificationService(
      ModuleClientAuthenticator moduleClientAuthenticator,
      MailClient mailClient,
      NotificationProperties notificationProperties,
      NotificationText notificationText,
      @Value("${eshg.citizen-portal.reverse-proxy.url}") String citizenPortalUrl) {
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.mailClient = mailClient;
    this.notificationProperties = notificationProperties;
    this.notificationText = notificationText;
    this.citizenPortalUrl = citizenPortalUrl;
  }

  public NotificationSummary notifyNewCitizenUser(
      MailEnabledProvider mailEnabledProvider, AffectedPersonDto person, String accessCode) {

    String newCitizenUserSubject = notificationText.getNewCitizenUserSubject();
    String newCitizenUserBody =
        notificationText.assembleNewCitizenUserBody(
            person.firstName(),
            person.lastName(),
            buildLoginUrl(accessCode),
            accessCode,
            notificationProperties.greeting());
    return doNotification(
        mailEnabledProvider,
        person,
        newCitizenUserSubject,
        () ->
            sendMailWithModuleClientAuthentication(
                newCitizenUserSubject, newCitizenUserBody, person, PLAIN_TEXT));
  }

  public void notifyNewCitizenProcedure(AffectedPersonDto person) {
    String newCitizenProcedureSubject = notificationText.getNewCitizenProcedureSubject();
    String newCitizenProcedureBody =
        notificationText.assembleNewCitizenProcedureBody(person.firstName(), person.lastName());

    sendMailWithModuleClientAuthentication(
        newCitizenProcedureSubject, newCitizenProcedureBody, person, HTML);
  }

  public void notifyNewDocument(
      AffectedPersonDto person, String documentTypeDe, String helpTextDe) {
    String newCitizenProcedureSubject = notificationText.getNewDocumentSubject();
    if (!helpTextDe.isBlank()) {
      helpTextDe = "- " + helpTextDe;
    }
    String newCitizenProcedureBody =
        notificationText.assembleNewDocumentBody(
            person.firstName(), person.lastName(), documentTypeDe, helpTextDe);

    sendMailWithModuleClientAuthentication(
        newCitizenProcedureSubject, newCitizenProcedureBody, person, HTML);
  }

  private NotificationSummary doNotification(
      MailEnabledProvider procedure,
      AffectedPersonDto person,
      String subject,
      IntSupplier sendMail) {

    if (!procedure.isSendEmailNotifications()) {
      return new NotificationSummary(subject, 0, NOTIFICATION_IS_DISABLED);
    }
    List<String> mailAddresses = person.emailAddresses();
    if (mailAddresses.isEmpty()) {
      return new NotificationSummary(subject, 0, MISSING_ADDRESSES);
    }

    int numSentMails = sendMail.getAsInt();
    return new NotificationSummary(subject, numSentMails, null);
  }

  private int sendMailWithModuleClientAuthentication(
      String subject, String body, AffectedPersonDto personDto, MailType mailType) {
    SecurityContext previousContext = securityContextHolderStrategy.getContext();
    try {
      securityContextHolderStrategy.clearContext();
      return moduleClientAuthenticator.doWithModuleClientAuthentication(
          () -> doSendMail(subject, body, personDto, mailType));
    } finally {
      securityContextHolderStrategy.setContext(previousContext);
    }
  }

  private int doSendMail(
      String subject, String body, AffectedPersonDto personDto, MailType mailType) {
    log.info("send mail(s): " + subject);

    for (String emailAddress : personDto.emailAddresses()) {
      mailClient.sendMail(
          emailAddress, notificationProperties.fromAddress(), subject, body, mailType);
    }
    return personDto.emailAddresses().size();
  }

  private String buildLoginUrl(String accessCode) {
    return UriComponentsBuilder.fromUriString(citizenPortalUrl)
        .pathSegment(CITIZEN_PORTAL_OMS_LOGIN_PATH)
        .queryParam("access_code", accessCode)
        .build()
        .toUriString();
  }
}

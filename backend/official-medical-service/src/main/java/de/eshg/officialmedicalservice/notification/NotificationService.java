/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.notification;

import de.eshg.departmentinfo.DepartmentInfoConfigService;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.officialmedicalservice.procedure.api.AffectedPersonDto;
import java.util.List;
import java.util.function.IntSupplier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
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

  private static final String CITIZEN_PORTAL_OMS_LOGIN_PATH = "amtsaerztlicherdienst/mein-bereich";

  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final MailClient mailClient;
  private final NotificationText notificationText;
  private final String citizenPortalUrl;
  private final DepartmentInfoConfigService departmentInfoService;

  @FunctionalInterface
  public interface MailEnabledProvider {
    boolean isSendEmailNotifications();
  }

  public NotificationService(
      ModuleClientAuthenticator moduleClientAuthenticator,
      MailClient mailClient,
      NotificationText notificationText,
      @Value("${eshg.citizen-portal.reverse-proxy.url}") String citizenPortalUrl,
      DepartmentInfoConfigService departmentInfoService) {
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.mailClient = mailClient;
    this.notificationText = notificationText;
    this.citizenPortalUrl = citizenPortalUrl;
    this.departmentInfoService = departmentInfoService;
  }

  public NotificationSummary notifyNewCitizenUser(
      MailEnabledProvider mailEnabledProvider, AffectedPersonDto person, String accessCode) {

    String newCitizenUserSubject = notificationText.getNewCitizenUserSubject();
    String newCitizenUserBody =
        notificationText.assembleNewCitizenUserBody(
            person.firstName(), person.lastName(), buildLoginUrl(accessCode), accessCode);
    return doNotification(
        mailEnabledProvider,
        person,
        newCitizenUserSubject,
        () ->
            sendMailWithModuleClientAuthentication(
                newCitizenUserSubject, newCitizenUserBody, person));
  }

  public void notifyNewCitizenProcedure(AffectedPersonDto person) {
    String newCitizenProcedureSubject = notificationText.getNewCitizenProcedureSubject();
    String newCitizenProcedureBody = notificationText.getNewCitizenProcedureBody();

    sendMailWithModuleClientAuthentication(
        newCitizenProcedureSubject, newCitizenProcedureBody, person);
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
        newCitizenProcedureSubject, newCitizenProcedureBody, person);
  }

  public void notifyNewAppointmentWithBooking(
      AffectedPersonDto person,
      String appointmentDate,
      String appointmentTime,
      String appointmentDuration) {
    String newAppointmentWithBookingSubject =
        notificationText.getNewAppointmentWithBookingSubject();
    String newAppointmentWithBookingBody =
        notificationText.assembleNewAppointmentWithBookingBody(
            person.firstName(),
            person.lastName(),
            appointmentDate,
            appointmentTime,
            appointmentDuration);

    sendMailWithModuleClientAuthentication(
        newAppointmentWithBookingSubject, newAppointmentWithBookingBody, person);
  }

  public void notifyNewAppointmentSelfBooking(
      AffectedPersonDto person, String appointmentDuration) {
    String newAppointmentWithBookingSubject =
        notificationText.getNewAppointmentSelfBookingSubject();
    String newAppointmentWithBookingBody =
        notificationText.assembleNewAppointmentSelfBookingBody(
            person.firstName(), person.lastName(), appointmentDuration);

    sendMailWithModuleClientAuthentication(
        newAppointmentWithBookingSubject, newAppointmentWithBookingBody, person);
  }

  public void notifyCancelAppointment(
      AffectedPersonDto person,
      String appointmentDate,
      String appointmentTime,
      String reasonForRejection) {
    String cancelAppointmentSubject = notificationText.getCancelAppointmentSubject();
    String cancelAppointmentBody =
        notificationText.assembleCancelAppointmentBody(
            person.firstName(),
            person.lastName(),
            appointmentDate,
            appointmentTime,
            reasonForRejection);

    sendMailWithModuleClientAuthentication(cancelAppointmentSubject, cancelAppointmentBody, person);
  }

  public void notifyRebookAppointment(
      AffectedPersonDto person,
      String oldAppointmentDate,
      String oldAppointmentTime,
      String newAppointmentDate,
      String newAppointmentTime) {
    String rebookAppointmentSubject = notificationText.getRebookAppointmentSubject();
    String rebookAppointmentBody =
        notificationText.assembleRebookAppointmentBody(
            person.firstName(),
            person.lastName(),
            oldAppointmentDate,
            oldAppointmentTime,
            newAppointmentDate,
            newAppointmentTime);

    sendMailWithModuleClientAuthentication(rebookAppointmentSubject, rebookAppointmentBody, person);
  }

  public void notifyCloseAppointment(AffectedPersonDto person) {
    String closeAppointmentSubject = notificationText.getCloseAppointmentSubject();
    String closeAppointmentBody =
        notificationText.assembleCloseAppointmentBody(person.firstName(), person.lastName());

    sendMailWithModuleClientAuthentication(closeAppointmentSubject, closeAppointmentBody, person);
  }

  public void notifyBookAppointmentCp(
      AffectedPersonDto person, String appointmentDate, String appointmentTime) {
    String bookAppointmentCpSubject = notificationText.getBookAppointmentCpSubject();
    String bookAppointmentCpBody =
        notificationText.assembleBookAppointmentCpBody(
            person.firstName(), person.lastName(), appointmentDate, appointmentTime);

    sendMailWithModuleClientAuthentication(bookAppointmentCpSubject, bookAppointmentCpBody, person);
  }

  public void notifyRebookAppointmentCp(
      AffectedPersonDto person,
      String oldAppointmentDate,
      String oldAppointmentTime,
      String newAppointmentDate,
      String newAppointmentTime) {
    String rebookAppointmentCpSubject = notificationText.getRebookAppointmentCpSubject();
    String rebookAppointmentCpBody =
        notificationText.assembleRebookAppointmentCpBody(
            person.firstName(),
            person.lastName(),
            oldAppointmentDate,
            oldAppointmentTime,
            newAppointmentDate,
            newAppointmentTime);

    sendMailWithModuleClientAuthentication(
        rebookAppointmentCpSubject, rebookAppointmentCpBody, person);
  }

  public void notifyCancelAppointmentCp(
      AffectedPersonDto person, String appointmentDate, String appointmentTime) {
    String cancelAppointmentCpSubject = notificationText.getCancelAppointmentCpSubject();
    String cancelAppointmentCpBody =
        notificationText.assembleCancelAppointmentCpBody(
            person.firstName(), person.lastName(), appointmentDate, appointmentTime);

    sendMailWithModuleClientAuthentication(
        cancelAppointmentCpSubject, cancelAppointmentCpBody, person);
  }

  public void notifyReviewDocumentAccepted(AffectedPersonDto person, String documentType) {
    String reviewDocumentAcceptedSubject = notificationText.getReviewDocumentAcceptedSubject();
    String reviewDocumentAcceptedBody =
        notificationText.assembleReviewDocumentAcceptedBody(
            person.firstName(), person.lastName(), documentType);

    sendMailWithModuleClientAuthentication(
        reviewDocumentAcceptedSubject, reviewDocumentAcceptedBody, person);
  }

  public void notifyReviewDocumentRejected(
      AffectedPersonDto person, String documentType, String reasonForRejection) {
    String reviewDocumentRejectedSubject = notificationText.getReviewDocumentRejectedSubject();
    String reviewDocumentRejectedBody =
        notificationText.assembleReviewDocumentRejectedBody(
            person.firstName(), person.lastName(), documentType, reasonForRejection);

    sendMailWithModuleClientAuthentication(
        reviewDocumentRejectedSubject, reviewDocumentRejectedBody, person);
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
      String subject, String body, AffectedPersonDto personDto) {
    return moduleClientAuthenticator.doWithPotentiallyReplacedModuleClientAuthenticator(
        () -> doSendMail(subject, body, personDto));
  }

  private int doSendMail(String subject, String body, AffectedPersonDto personDto) {
    log.info("send mail(s): {}", subject);
    String fromAddress = departmentInfoService.getDepartmentInfo().email();

    for (String emailAddress : personDto.emailAddresses()) {
      mailClient.sendMail(emailAddress, fromAddress, subject, body);
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

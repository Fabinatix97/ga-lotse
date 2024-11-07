/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.notification;

import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatientDto;
import java.time.Instant;
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

  private static final String CITIZEN_PORTAL_RMBI_LOGIN_PATH = "impfberatung/meine-termine";
  private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

  private final MailClient mailClient;
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final NotificationProperties notificationProperties;
  private final String citizenPortalUrl;
  private final NotificationText notificationText;
  private final SecurityContextHolderStrategy securityContextHolderStrategy =
      SecurityContextHolder.getContextHolderStrategy();

  public NotificationService(
      MailClient mailClient,
      ModuleClientAuthenticator moduleClientAuthenticator,
      NotificationProperties notificationProperties,
      @Value("${eshg.citizen-portal.reverse-proxy.url}") String citizenPortalUrl,
      NotificationText notificationText) {
    this.mailClient = mailClient;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.notificationProperties = notificationProperties;
    this.citizenPortalUrl = citizenPortalUrl;
    this.notificationText = notificationText;
  }

  public void notifyNewCitizenProcedure(
      PatientDto patientDto, Instant firstAppointment, String accessCode) {
    sendMailWithModuleClientAuthentication(
        notificationText.getNewCitizenProcedureSubject(),
        notificationText.getNewCitizenProcedureBody(
            patientDto.firstName(),
            patientDto.lastName(),
            firstAppointment,
            buildLoginUrl(accessCode),
            accessCode,
            notificationProperties.greeting()),
        patientDto);
  }

  public void notifyBookedByCitizen(PatientDto patientDto, Instant appointment) {
    sendMailWithModuleClientAuthentication(
        notificationText.getBookingByCitizenSubject(),
        notificationText.getBookingByCitizenBody(
            patientDto.firstName(),
            patientDto.lastName(),
            appointment,
            notificationProperties.greeting()),
        patientDto);
  }

  public void notifyBookedByEmployee(PatientDto patientDto, Instant appointment) {
    sendMailWithModuleClientAuthentication(
        notificationText.getBookingByEmployeeSubject(),
        notificationText.getBookingByEmployeeBody(
            patientDto.firstName(),
            patientDto.lastName(),
            appointment,
            notificationProperties.greeting()),
        patientDto);
  }

  public void notifyCancelledByCitizen(PatientDto patientDto, Instant cancelledAppointment) {
    sendMailWithModuleClientAuthentication(
        notificationText.getCancellationByCitizenSubject(),
        notificationText.getCancellationByCitizenBody(
            patientDto.firstName(),
            patientDto.lastName(),
            cancelledAppointment,
            notificationProperties.greeting()),
        patientDto);
  }

  public void notifyCancelledByEmployee(PatientDto patientDto, Instant cancelledAppointment) {
    sendMailWithModuleClientAuthentication(
        notificationText.getCancellationByEmployeeSubject(),
        notificationText.getCancellationByEmployeeBody(
            patientDto.firstName(),
            patientDto.lastName(),
            cancelledAppointment,
            notificationProperties.greeting()),
        patientDto);
  }

  public void notifyRebookedByCitizen(
      PatientDto patientDto, Instant previousAppointment, Instant newAppointment) {
    sendMailWithModuleClientAuthentication(
        notificationText.getRebookingByCitizenSubject(),
        notificationText.getRebookingByCitizenBody(
            patientDto.firstName(),
            patientDto.lastName(),
            previousAppointment,
            newAppointment,
            notificationProperties.greeting()),
        patientDto);
  }

  public void notifyRebookedByEmployee(
      PatientDto patientDto, Instant previousAppointment, Instant newAppointment) {
    sendMailWithModuleClientAuthentication(
        notificationText.getRebookingByEmployeeSubject(),
        notificationText.getRebookingByEmployeeBody(
            patientDto.firstName(),
            patientDto.lastName(),
            previousAppointment,
            newAppointment,
            notificationProperties.greeting()),
        patientDto);
  }

  public void notifyNewInformationStatement(PatientDto patientDto) {
    sendMailWithModuleClientAuthentication(
        notificationText.getNewInformationStatementSubject(),
        notificationText.getNewInformationStatementBody(
            patientDto.firstName(), patientDto.lastName(), notificationProperties.greeting()),
        patientDto);
  }

  public void notifyNewFollowUpAppointment(PatientDto patientDto) {
    sendMailWithModuleClientAuthentication(
        notificationText.getNewFollowUpAppointmentSubject(),
        notificationText.getNewFollowUpAppointmentBody(
            patientDto.firstName(), patientDto.lastName(), notificationProperties.greeting()),
        patientDto);
  }

  private String buildLoginUrl(String accessCode) {
    return UriComponentsBuilder.fromUriString(citizenPortalUrl)
        .pathSegment(CITIZEN_PORTAL_RMBI_LOGIN_PATH)
        .queryParam("access_code", accessCode)
        .build()
        .toUriString();
  }

  private void sendMailWithModuleClientAuthentication(
      String subject, String body, PatientDto patientDto) {
    SecurityContext previousContext = securityContextHolderStrategy.getContext();
    try {
      securityContextHolderStrategy.clearContext();
      moduleClientAuthenticator.doWithModuleClientAuthentication(
          () -> doSendMail(subject, body, patientDto));
    } finally {
      securityContextHolderStrategy.setContext(previousContext);
    }
  }

  private void doSendMail(String subject, String body, PatientDto patientDto) {
    log.info("send mail(s): " + subject);
    for (String emailAddress : patientDto.emailAddresses()) {
      mailClient.sendMail(emailAddress, notificationProperties.fromAddress(), subject, body);
    }
  }
}

/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.notification;

import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatientDto;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class NotificationService {

  private static final String CITIZEN_PORTAL_RMBI_LOGIN_PATH = "impfberatung/meine-termine";
  private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

  private final MailClient mailClient;
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final String citizenPortalUrl;
  private final NotificationText notificationText;
  private final NotificationConfigService notificationConfigService;

  public NotificationService(
      MailClient mailClient,
      ModuleClientAuthenticator moduleClientAuthenticator,
      @Value("${eshg.citizen-portal.reverse-proxy.url}") String citizenPortalUrl,
      NotificationText notificationText,
      NotificationConfigService notificationConfigService) {
    this.mailClient = mailClient;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.citizenPortalUrl = citizenPortalUrl;
    this.notificationText = notificationText;
    this.notificationConfigService = notificationConfigService;
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
            notificationConfigService.getConfig().getGreeting()),
        patientDto);
  }

  public void notifyBookedByCitizen(PatientDto patientDto, Instant appointment) {
    sendMailWithModuleClientAuthentication(
        notificationText.getBookingByCitizenSubject(),
        notificationText.getBookingByCitizenBody(
            patientDto.firstName(),
            patientDto.lastName(),
            appointment,
            notificationConfigService.getConfig().getGreeting()),
        patientDto);
  }

  public void notifyBookedByEmployee(PatientDto patientDto, Instant appointment) {
    sendMailWithModuleClientAuthentication(
        notificationText.getBookingByEmployeeSubject(),
        notificationText.getBookingByEmployeeBody(
            patientDto.firstName(),
            patientDto.lastName(),
            appointment,
            notificationConfigService.getConfig().getGreeting()),
        patientDto);
  }

  public void notifyCancelledByCitizen(PatientDto patientDto, Instant cancelledAppointment) {
    sendMailWithModuleClientAuthentication(
        notificationText.getCancellationByCitizenSubject(),
        notificationText.getCancellationByCitizenBody(
            patientDto.firstName(),
            patientDto.lastName(),
            cancelledAppointment,
            notificationConfigService.getConfig().getGreeting()),
        patientDto);
  }

  public void notifyCancelledByEmployee(PatientDto patientDto, Instant cancelledAppointment) {
    sendMailWithModuleClientAuthentication(
        notificationText.getCancellationByEmployeeSubject(),
        notificationText.getCancellationByEmployeeBody(
            patientDto.firstName(),
            patientDto.lastName(),
            cancelledAppointment,
            notificationConfigService.getConfig().getGreeting()),
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
            notificationConfigService.getConfig().getGreeting()),
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
            notificationConfigService.getConfig().getGreeting()),
        patientDto);
  }

  public void notifyNewInformationStatement(PatientDto patientDto) {
    sendMailWithModuleClientAuthentication(
        notificationText.getNewInformationStatementSubject(),
        notificationText.getNewInformationStatementBody(
            patientDto.firstName(),
            patientDto.lastName(),
            notificationConfigService.getConfig().getGreeting()),
        patientDto);
  }

  public void notifyNewFollowUpAppointment(PatientDto patientDto) {
    sendMailWithModuleClientAuthentication(
        notificationText.getNewFollowUpAppointmentSubject(),
        notificationText.getNewFollowUpAppointmentBody(
            patientDto.firstName(),
            patientDto.lastName(),
            notificationConfigService.getConfig().getGreeting()),
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
    moduleClientAuthenticator.doWithPotentiallyReplacedModuleClientAuthenticator(
        () -> doSendMail(subject, body, patientDto));
  }

  private void doSendMail(String subject, String body, PatientDto patientDto) {
    log.info("send mail(s): " + subject);
    for (String emailAddress : patientDto.emailAddresses()) {
      mailClient.sendMail(
          emailAddress, notificationConfigService.getConfig().getFromAddress(), subject, body);
    }
  }
}

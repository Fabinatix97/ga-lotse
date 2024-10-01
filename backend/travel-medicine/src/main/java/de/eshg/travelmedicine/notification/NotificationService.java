/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.notification;

import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatientDto;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStep;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class NotificationService {

  private static final String CITIZEN_PORTAL_RMBI_LOGIN_PATH = "impfberatung/meine-termine";

  private final MailClient mailClient;
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final NotificationProperties notificationProperties;
  private final String citizenPortalUrl;

  public NotificationService(
      MailClient mailClient,
      ModuleClientAuthenticator moduleClientAuthenticator,
      NotificationProperties notificationProperties,
      @Value("${eshg.citizen-portal.reverse-proxy.url}") String citizenPortalUrl) {
    this.mailClient = mailClient;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.notificationProperties = notificationProperties;
    this.citizenPortalUrl = citizenPortalUrl;
    ;
  }

  public void onNewCitizenProcedure(
      String accessCode, PatientDto patientDto, ProcedureStep procedureStep) {
    String text =
        NotificationText.getNewCitizenProcedureBody(
            patientDto.firstName(),
            patientDto.lastName(),
            procedureStep.getAppointment().getAppointmentStart(),
            buildLoginUrl(accessCode),
            accessCode,
            notificationProperties.greeting());

    moduleClientAuthenticator.doWithModuleClientAuthentication(
        () ->
            mailClient.sendMail(
                patientDto.emailAddresses().getFirst(),
                notificationProperties.fromAddress(),
                NotificationText.getNewCitizenProcedureSubject(),
                text));
  }

  private String buildLoginUrl(String accessCode) {
    return UriComponentsBuilder.fromUriString(citizenPortalUrl)
        .pathSegment(CITIZEN_PORTAL_RMBI_LOGIN_PATH)
        .queryParam("access_code", accessCode)
        .build()
        .toUriString();
  }
}

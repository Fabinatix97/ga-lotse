/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.notification;

import de.eshg.base.mail.MailApi;
import de.eshg.base.mail.SendEmailNotificationRequest;
import de.eshg.base.user.UserService;
import de.eshg.base.user.api.UserDto;
import de.eshg.base.user.api.UserFilterParameters;
import de.eshg.base.user.api.UserRoleDto;
import de.eshg.lib.keycloak.AdministrativeGroup;
import de.eshg.lib.notification.domain.model.SimpleNotification;
import de.eshg.lib.notification.domain.repository.SimpleNotificationRepository;
import jakarta.transaction.Transactional;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.keycloak.representations.idm.AbstractUserRepresentation;
import org.springframework.stereotype.Component;

@Component
public class AuditLogNotificationService {
  private final AuditLogNotificationProperties auditLogNotificationProperties;
  private final UserService userService;
  private final MailApi mailApi;
  private final SimpleNotificationRepository simpleNotificationRepository;
  private final Clock clock;

  public AuditLogNotificationService(
      AuditLogNotificationProperties auditLogNotificationProperties,
      UserService userService,
      MailApi mailApi,
      SimpleNotificationRepository simpleNotificationRepository,
      Clock clock) {
    this.auditLogNotificationProperties = auditLogNotificationProperties;
    this.userService = userService;
    this.mailApi = mailApi;
    this.simpleNotificationRepository = simpleNotificationRepository;
    this.clock = clock;
  }

  @Transactional
  void sendNotifications() {
    List<UserDto> usersWithDecryptAccess =
        userService.getUsers(
            new UserFilterParameters(UserRoleDto.AUDITLOG_DECRYPT_AND_ACCESS, null));
    if (usersWithDecryptAccess.isEmpty()) {
      createMissingWorkCouncilNotifications();
      return;
    }

    int configuredAuditlogKeys = userService.getAllPublicEmployeeUserKeys().size();

    if (configuredAuditlogKeys == 0) {
      createNoAuditlogKeyConfiguredNotifications();
      return;
    }

    if (configuredAuditlogKeys
        < auditLogNotificationProperties.getMinimalConfiguredAuditlogKeys()) {
      createTooFewAuditlogKeysConfiguredNotification();
    }
  }

  private void createNoAuditlogKeyConfiguredNotifications() {
    saveAndSendMails(
        getUserAdminIds().stream().map(this::mapToNoAuditlogKeyConfiguredNotification).toList());
  }

  private void createTooFewAuditlogKeysConfiguredNotification() {
    saveAndSendMails(
        getUserAdminIds().stream().map(this::mapToMissingKeyConfigurationNotification).toList());
  }

  private void createMissingWorkCouncilNotifications() {
    saveAndSendMails(
        getUserAdminIds().stream()
            .map(AuditLogNotificationService::mapToMissingWorkCouncilNotification)
            .toList());
  }

  private List<UUID> getUserAdminIds() {
    return userService
        .getUsersByGroup(AdministrativeGroup.USER_ADMINISTRATOR.getKeycloakName())
        .stream()
        .map(AbstractUserRepresentation::getId)
        .map(UUID::fromString)
        .toList();
  }

  private void saveAndSendMails(List<SimpleNotification> notifications) {
    notifications.forEach(notification -> notification.setMailSentAt(Instant.now(clock)));

    notifications.stream()
        .map(AuditLogNotificationService::mapToEmail)
        .forEach(mailApi::sendEmailNotification);

    simpleNotificationRepository.saveAll(notifications);
  }

  private static SendEmailNotificationRequest mapToEmail(SimpleNotification simpleNotification) {
    return new SendEmailNotificationRequest(
        simpleNotification.getRecipientUserId(), simpleNotification.getMessage());
  }

  private SimpleNotification mapToMissingKeyConfigurationNotification(UUID adminId) {
    return new SimpleNotification(
        adminId,
        "Zu wenig Schlüssel konfiguriert",
        """
        Aktuell existieren weniger als %s Mitarbeiter mit Betriebsratsrolle, die sich einen Public Key für die Auditlog-Verschlüsselung generiert haben.
        Dies ist ein Risiko, da bei Passwortverlust oder längerer Abwesenheit nicht auf das Auditlog zugegriffen werden kann."""
            .formatted(auditLogNotificationProperties.getMinimalConfiguredAuditlogKeys()));
  }

  private static SimpleNotification mapToMissingWorkCouncilNotification(UUID adminId) {
    return new SimpleNotification(
        adminId,
        "Fehlende Betriebsrat Nutzer",
        """
      Aktuell existiert kein User mit Betriebsratsrolle. Daher kann derzeit KEIN Auditlog geschrieben werden.
      """);
  }

  private SimpleNotification mapToNoAuditlogKeyConfiguredNotification(UUID adminId) {
    return new SimpleNotification(
        adminId,
        "Kein Schlüssel konfiguriert",
        """
    Aktuell existiert kein User mit Betriebsratsrolle, der sich einen Public Key für die Auditlog-Verschlüsselung generiert hat. Daher kann derzeit KEIN Auditlog geschrieben werden.
    """);
  }
}

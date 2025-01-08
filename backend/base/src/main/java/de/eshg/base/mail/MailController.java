/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.mail;

import de.eshg.base.department.DepartmentConfiguration;
import de.eshg.base.user.UserService;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.CurrentUserHelper;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.LinkedHashMap;
import java.util.Map;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.RestController;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@RestController
@Tag(name = "Mail")
public class MailController implements MailApi {

  private final AuditLogger auditLogger;
  private final UserService userService;
  private final DepartmentConfiguration departmentConfiguration;
  private final JavaMailSender mailSender;
  private final TemplateEngine templateEngine;
  private final String defaultFrom;

  public MailController(
      AuditLogger auditLogger,
      UserService userService,
      DepartmentConfiguration departmentConfiguration,
      JavaMailSender mailSender,
      TemplateEngine templateEngine,
      @Value("${eshg.mail.noreply}") String defaultFrom) {
    this.auditLogger = auditLogger;
    this.userService = userService;
    this.departmentConfiguration = departmentConfiguration;
    this.mailSender = mailSender;
    this.templateEngine = templateEngine;
    this.defaultFrom = defaultFrom;
  }

  @Override
  public void sendEmail(SendEmailRequest request) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(request.from() != null ? request.from() : defaultFrom);
    message.setTo(request.to());
    message.setSubject(request.subject());
    message.setText(request.text());
    mailSender.send(message);
    writeAuditLog(Map.of("Typ", "Klartext"));
  }

  @Override
  public void sendEmailNotification(SendEmailNotificationRequest request) {
    try {
      UserRepresentation addressee =
          userService
              .getUserById(request.userId())
              .orElseThrow(() -> new BadRequestException("User does not exist."));

      Context context = new Context();
      context.setVariable("notificationMessage", request.notificationMessage());
      context.setVariable("firstName", addressee.getFirstName());
      context.setVariable("lastName", addressee.getLastName());
      context.setVariable("departmentName", departmentConfiguration.name());
      context.setVariable("departmentStreet", departmentConfiguration.street());
      context.setVariable("departmentHouseNumber", departmentConfiguration.houseNumber());
      context.setVariable("departmentCity", departmentConfiguration.city());
      context.setVariable("departmentPostalCode", departmentConfiguration.postalCode());

      String process = templateEngine.process("user-notification-mail", context);

      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setFrom(defaultFrom);
      helper.setTo(addressee.getEmail());
      helper.setSubject(
          "(GA-Lotse %s) Neue Benachrichtigung".formatted(departmentConfiguration.abbreviation()));
      helper.setText(process, true);
      mailSender.send(message);
      writeAuditLog(
          Map.of("Typ", "Erinnerung Benachrichtung", "an Benutzer", request.userId().toString()));
    } catch (MessagingException e) {
      throw new RuntimeException("Could not create and send email notification.", e);
    }
  }

  private void writeAuditLog(Map<String, String> attributes) {
    attributes = new LinkedHashMap<>(attributes);
    attributes.put(
        "durch Benutzer", CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"));

    auditLogger.log("Mail", "Versand", attributes);
  }
}

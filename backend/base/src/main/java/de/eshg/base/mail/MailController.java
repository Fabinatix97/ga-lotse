/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.mail;

import com.google.common.base.Supplier;
import com.google.common.base.Suppliers;
import de.eshg.base.department.DepartmentConfiguration;
import de.eshg.base.user.UserService;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.CurrentUserHelper;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Calendar;
import java.util.LinkedHashMap;
import java.util.Map;
import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.PNGTranscoder;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
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
  private final String citizenPortalUrl;
  private final Supplier<String> logoBase64PngSupplier;

  public MailController(
      AuditLogger auditLogger,
      UserService userService,
      DepartmentConfiguration departmentConfiguration,
      JavaMailSender mailSender,
      TemplateEngine templateEngine,
      @Value("${eshg.mail.noreply}") String defaultFrom,
      @Value("${eshg.citizen-portal.reverse-proxy.url}") String citizenPortalUrl) {
    this.auditLogger = auditLogger;
    this.userService = userService;
    this.departmentConfiguration = departmentConfiguration;
    this.mailSender = mailSender;
    this.templateEngine = templateEngine;
    this.defaultFrom = defaultFrom;
    this.citizenPortalUrl = citizenPortalUrl;
    logoBase64PngSupplier = Suppliers.memoize(() -> svgToBase64Png(departmentConfiguration.logo()));
  }

  @Override
  public void sendEmail(SendEmailRequest request) {
    MimeMessage mimeMessage = mailSender.createMimeMessage();
    try {
      MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
      helper.setFrom(request.from() != null ? request.from() : defaultFrom);
      helper.setTo(request.to());
      helper.setSubject(request.subject());
      switch (request.type()) {
        case PLAIN_TEXT -> helper.setText(request.text(), false);
        case HTML -> helper.setText(applyHtmlTemplate(request.subject(), request.text()), true);
      }
    } catch (MessagingException e) {
      throw new RuntimeException("Could not create and send email.", e);
    }
    mailSender.send(mimeMessage);
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

  String applyHtmlTemplate(String subject, String content) {
    Context context = new Context();
    context.setVariable("title", subject);
    context.setVariable("content", content);
    context.setVariable("departmentName", departmentConfiguration.name());
    context.setVariable("departmentCity", departmentConfiguration.city());
    context.setVariable("logoBase64Png", logoBase64PngSupplier.get());
    context.setVariable("citizenPortalUrl", citizenPortalUrl);
    context.setVariable("year", Calendar.getInstance().get(Calendar.YEAR));

    return templateEngine.process("citizen-email", context);
  }

  private void writeAuditLog(Map<String, String> attributes) {
    attributes = new LinkedHashMap<>(attributes);
    attributes.put(
        "durch Benutzer", CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"));

    auditLogger.log("Mail", "Versand", attributes);
  }

  public static String svgToBase64Png(Resource svg) {
    try (ByteArrayOutputStream pngStream = new ByteArrayOutputStream()) {
      TranscoderInput transcoderInput = new TranscoderInput(svg.getInputStream());
      TranscoderOutput transcoderOutput = new TranscoderOutput(pngStream);
      PNGTranscoder pngTranscoder = new PNGTranscoder();
      pngTranscoder.transcode(transcoderInput, transcoderOutput);
      return Base64.getEncoder().encodeToString(pngStream.toByteArray());
    } catch (TranscoderException | IOException e) {
      throw new RuntimeException(e);
    }
  }
}

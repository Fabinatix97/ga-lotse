/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.mail;

import de.eshg.base.config.BaseDepartmentInfoConfigService;
import de.eshg.base.config.DepartmentConfigurationService;
import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.base.user.UserService;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.CurrentUserHelper;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.ByteArrayInputStream;
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
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@RestController
@Tag(name = "Mail")
public class MailController implements MailApi {

  private final AuditLogger auditLogger;
  private final UserService userService;
  private final DepartmentConfigurationService departmentConfigurationService;
  private final BaseDepartmentInfoConfigService baseDepartmentInfoService;
  private final JavaMailSender mailSender;
  private final TemplateEngine templateEngine;
  private final String defaultFrom;
  private final String citizenPortalUrl;

  public MailController(
      AuditLogger auditLogger,
      UserService userService,
      DepartmentConfigurationService departmentConfigurationService,
      BaseDepartmentInfoConfigService baseDepartmentInfoService,
      JavaMailSender mailSender,
      TemplateEngine templateEngine,
      @Value("${eshg.mail.noreply}") String defaultFrom,
      @Value("${eshg.citizen-portal.reverse-proxy.url}") String citizenPortalUrl) {
    this.auditLogger = auditLogger;
    this.userService = userService;
    this.departmentConfigurationService = departmentConfigurationService;
    this.baseDepartmentInfoService = baseDepartmentInfoService;
    this.mailSender = mailSender;
    this.templateEngine = templateEngine;
    this.defaultFrom = defaultFrom;
    this.citizenPortalUrl = citizenPortalUrl;
  }

  @Override
  @Transactional
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
        case HTML_AND_PLAIN_TEXT ->
            helper.setText(
                HtmlToPlainTextConverter.convert(request.text()),
                applyHtmlTemplate(request.subject(), request.text()));
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

      GetDepartmentInfoResponse departmentInfo = baseDepartmentInfoService.getDepartmentInfo();

      Context context = new Context();
      context.setVariable("notificationMessage", request.notificationMessage());
      context.setVariable("firstName", addressee.getFirstName());
      context.setVariable("lastName", addressee.getLastName());
      context.setVariable("departmentName", departmentInfo.name());
      context.setVariable("departmentStreet", departmentInfo.street());
      context.setVariable("departmentHouseNumber", departmentInfo.houseNumber());
      context.setVariable("departmentCity", departmentInfo.city());
      context.setVariable("departmentPostalCode", departmentInfo.postalCode());

      String process = templateEngine.process("user-notification-mail", context);

      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setFrom(defaultFrom);
      helper.setTo(addressee.getEmail());
      helper.setSubject(
          "(GA-Lotse %s) Neue Benachrichtigung".formatted(departmentInfo.abbreviation()));
      helper.setText(process, true);
      mailSender.send(message);
      writeAuditLog(
          Map.of("Typ", "Erinnerung Benachrichtung", "an Benutzer", request.userId().toString()));
    } catch (MessagingException e) {
      throw new RuntimeException("Could not create and send email notification.", e);
    }
  }

  String applyHtmlTemplate(String subject, String content) {
    GetDepartmentInfoResponse departmentInfo = baseDepartmentInfoService.getDepartmentInfo();
    Context context = new Context();
    context.setVariable("title", subject);
    context.setVariable("content", content);
    context.setVariable("departmentName", departmentInfo.name());
    context.setVariable("departmentCity", departmentInfo.city());
    context.setVariable("logoBase64Png", svgToBase64Png(departmentConfigurationService.getLogo()));
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

  private static String svgToBase64Png(byte[] svg) {
    try (ByteArrayInputStream svgInputStream = new ByteArrayInputStream(svg);
        ByteArrayOutputStream pngStream = new ByteArrayOutputStream()) {
      TranscoderInput transcoderInput = new TranscoderInput(svgInputStream);
      TranscoderOutput transcoderOutput = new TranscoderOutput(pngStream);
      PNGTranscoder pngTranscoder = new PNGTranscoder();
      pngTranscoder.transcode(transcoderInput, transcoderOutput);
      return Base64.getEncoder().encodeToString(pngStream.toByteArray());
    } catch (TranscoderException | IOException e) {
      throw new RuntimeException(e);
    }
  }
}

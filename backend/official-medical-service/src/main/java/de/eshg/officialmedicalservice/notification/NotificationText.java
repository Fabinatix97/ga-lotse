/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.notification;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

@Component
public class NotificationText {

  private final DateTimeFormatter appointmentStartFormat =
      DateTimeFormatter.ofPattern("dd.MM.yyyy, HH:mm", Locale.GERMAN);

  @Value("${de.eshg.official-medical-service.notification.template.new_citizen_user.subject}")
  private String newCitizenUserSubject;

  @Value("${de.eshg.official-medical-service.notification.template.new_citizen_user.body}")
  private Resource newCitizenUserBodyTemplate;

  public String getNewCitizenUserSubject() {
    return newCitizenUserSubject;
  }

  public String assembleNewCitizenUserBody(
      String firstName, String lastName, String loginUrl, String accessCode, String greeting) {

    String templateBody = readTemplateBody(newCitizenUserBodyTemplate);

    return String.format(templateBody, firstName, lastName, loginUrl, accessCode, greeting);
  }

  private static String readTemplateBody(Resource bodyTemplateResource) {
    try (Reader reader =
        new InputStreamReader(bodyTemplateResource.getInputStream(), StandardCharsets.UTF_8)) {
      return FileCopyUtils.copyToString(reader);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }
}

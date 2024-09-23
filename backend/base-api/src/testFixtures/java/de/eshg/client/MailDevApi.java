/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.client;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class MailDevApi {

  public static final String MAIL_DEV_HOST_PROPERTY = "de.eshg.maildev.baseUrl";
  private final RestClient client;

  public MailDevApi(
      @Autowired RestClient.Builder restTemplate,
      @Value("${" + MAIL_DEV_HOST_PROPERTY + "}") String mailDevServiceUrl) {
    client = restTemplate.baseUrl(mailDevServiceUrl).build();
  }

  public void cleanInbox() {
    client.delete().uri("/email/all").retrieve().toBodilessEntity();
  }

  public List<MailDevReceivedMail> getMailsWithSubject(String subject) {
    return client
        .get()
        .uri(builder -> builder.path("email").queryParam("subject", subject).build())
        .retrieve()
        .body(new ParameterizedTypeReference<>() {});
  }

  public List<MailDevReceivedMail> getMails() {
    return client
        .get()
        .uri(builder -> builder.path("email").build())
        .retrieve()
        .body(new ParameterizedTypeReference<>() {});
  }

  public List<MailDevReceivedMail> getMailFromServerWithToAddress(String to) {
    return client
        .get()
        .uri(builder -> builder.path("email").queryParam("to.address", to).build())
        .retrieve()
        .body(new ParameterizedTypeReference<>() {});
  }
}

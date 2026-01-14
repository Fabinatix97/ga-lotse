/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.mail;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(url = MailApi.BASE_URL)
public interface MailApi {
  String BASE_URL = "/mail";
  String NOTIFICATION_SUFFIX = "/notification";

  @PostExchange()
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Send an email to a single recipient.")
  void sendEmail(@RequestBody @Valid SendEmailRequest request);

  @PostExchange(url = NOTIFICATION_SUFFIX)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Send an email notification via template.")
  void sendEmailNotification(@RequestBody @Valid SendEmailNotificationRequest request);
}

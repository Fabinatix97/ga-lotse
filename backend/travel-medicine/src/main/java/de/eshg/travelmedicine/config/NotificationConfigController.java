/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.config;

import static de.eshg.travelmedicine.notification.NotificationConfigMapper.mapToDomain;
import static de.eshg.travelmedicine.notification.NotificationConfigMapper.mapToDto;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.travelmedicine.notification.NotificationConfigService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "NotificationConfig")
@RequestMapping(NotificationConfigController.BASE_URL)
public class NotificationConfigController {
  static final String BASE_URL =
      BaseUrls.DepartmentInfoLibrary.CONFIGURATION_API + "/rmbi-properties";

  private final NotificationConfigService notificationConfigService;

  public NotificationConfigController(NotificationConfigService notificationConfigService) {
    this.notificationConfigService = notificationConfigService;
  }

  @Transactional(readOnly = true)
  @GetMapping
  public GetNotificationConfigResponse getNotificationConfig() {
    return new GetNotificationConfigResponse(
        mapToDto(notificationConfigService.getNotificationConfig()));
  }

  @Transactional
  @PutMapping
  public void updateNotificationConfig(
      @Valid @RequestBody NotificationConfigDto notificationConfigDto) {
    notificationConfigService.updateNotificationConfig(mapToDomain(notificationConfigDto));
  }
}

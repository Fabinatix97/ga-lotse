/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.controller;

import static de.eshg.chat.service.UserSettingsService.mapTo;

import de.eshg.chat.featuretoggle.ChatFeature;
import de.eshg.chat.featuretoggle.ChatFeatureToggle;
import de.eshg.chat.model.dto.UserSettingsRequest;
import de.eshg.chat.model.dto.UserSettingsResponse;
import de.eshg.chat.service.SynapseAuthorizationService;
import de.eshg.chat.service.UserSettingsService;
import de.eshg.persistence.IntentionalWritingTransaction;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RequestMapping(path = UserSettingsController.BASE_URL)
@RestController
@Tag(name = "UserSettings")
public class UserSettingsController {

  public static final String BASE_URL = BaseUrls.ChatManagement.USER_SETTINGS_CONTROLLER;

  private final UserSettingsService userSettingsService;
  private final ChatFeatureToggle featureToggle;
  private final SynapseAuthorizationService authorizationService;

  public UserSettingsController(
      UserSettingsService userSettingsService,
      ChatFeatureToggle featureToggle,
      SynapseAuthorizationService authorizationService) {
    this.userSettingsService = userSettingsService;
    this.featureToggle = featureToggle;
    this.authorizationService = authorizationService;
  }

  @GetMapping
  @Transactional
  @IntentionalWritingTransaction(reason = "Default settings are created if missing")
  public UserSettingsResponse getOrCreateDefaultUserSettings(@RequestParam @Valid String userId) {
    featureToggle.assertNewFeatureIsEnabled(ChatFeature.CHAT_BASE);
    authorizationService.validateIfUserIdBelongsToCurrentUser(userId);
    return mapTo(userSettingsService.getOrCreateDefaultSettings(userId));
  }

  @PostMapping
  @Transactional
  public UserSettingsResponse createOrUpdateUserSettings(
      @RequestBody @Valid UserSettingsRequest userSettingsRequest) {
    featureToggle.assertNewFeatureIsEnabled(ChatFeature.CHAT_BASE);
    authorizationService.validateIfUserIdBelongsToCurrentUser(userSettingsRequest.userId());
    return mapTo(userSettingsService.createOrUpdateUserSettings(userSettingsRequest));
  }
}

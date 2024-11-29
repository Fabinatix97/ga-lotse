/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.service;

import de.eshg.chat.domain.UserSettingsRepository;
import de.eshg.chat.domain.model.UserSettings;
import de.eshg.chat.model.dto.UserSettingsRequest;
import de.eshg.chat.model.dto.UserSettingsResponse;
import org.springframework.stereotype.Service;

@Service
public class UserSettingsService {

  private final UserSettingsRepository userSettingsRepository;

  public UserSettingsService(UserSettingsRepository userSettingsRepository) {
    this.userSettingsRepository = userSettingsRepository;
  }

  public UserSettings getOrCreateDefaultSettings(String userId) {
    return userSettingsRepository
        .findById(userId)
        .orElseGet(() -> userSettingsRepository.save(new UserSettings().userId(userId)));
  }

  public UserSettings createOrUpdateUserSettings(UserSettingsRequest userSettingsRequest) {
    return userSettingsRepository
        .findById(userSettingsRequest.userId())
        .map(userSettings -> mapOnlyNonNullFields(userSettings, userSettingsRequest))
        .orElseGet(() -> userSettingsRepository.save(mapTo(userSettingsRequest)));
  }

  public static UserSettings mapTo(UserSettingsRequest request) {
    return new UserSettings()
        .userId(request.userId())
        .chatUsageEnabled(request.chatUsageEnabled())
        .sharePresence(request.sharePresence())
        .showTypingNotification(request.showTypingNotification())
        .showReadConfirmation(request.showReadConfirmation())
        .chatConsentAsked(request.chatConsentAsked())
        .accountDeactivated(request.accountDeactivated());
  }

  public static UserSettingsResponse mapTo(UserSettings userSettings) {
    return new UserSettingsResponse(
        userSettings.getUserId(),
        userSettings.getChatUsageEnabled(),
        userSettings.getSharePresence(),
        userSettings.getShowTypingNotification(),
        userSettings.getChatConsentAsked(),
        userSettings.getShowReadConfirmation(),
        userSettings.getAccountDeactivated());
  }

  private UserSettings mapOnlyNonNullFields(
      UserSettings userSettings, UserSettingsRequest userSettingsRequest) {
    if (userSettingsRequest.chatUsageEnabled() != null) {
      userSettings.chatUsageEnabled(userSettingsRequest.chatUsageEnabled());
    }
    if (userSettingsRequest.sharePresence() != null) {
      userSettings.sharePresence(userSettingsRequest.sharePresence());
    }
    if (userSettingsRequest.showTypingNotification() != null) {
      userSettings.showTypingNotification(userSettingsRequest.showTypingNotification());
    }
    if (userSettingsRequest.showReadConfirmation() != null) {
      userSettings.showReadConfirmation(userSettingsRequest.showReadConfirmation());
    }
    if (userSettingsRequest.chatConsentAsked() != null) {
      userSettings.chatConsentAsked(userSettingsRequest.chatConsentAsked());
    }
    if (userSettingsRequest.accountDeactivated() != null) {
      userSettings.accountDeactivated(userSettingsRequest.accountDeactivated());
    }
    return userSettings;
  }
}

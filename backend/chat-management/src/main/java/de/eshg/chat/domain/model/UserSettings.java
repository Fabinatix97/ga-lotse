/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.domain.model;

import static de.eshg.lib.common.SensitivityLevel.PROTECTED;

import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.*;

@DataSensitivity(PROTECTED)
@Entity
public class UserSettings {

  @Id private String userId;

  private Boolean chatConsentAsked = false;
  private Boolean accountRegistered = false;
  private Boolean chatUsageEnabled = false;
  private Boolean sharePresence = false;
  private Boolean showTypingNotification = false;
  private Boolean showReadConfirmation = false;
  private Boolean accountDeactivated = false;

  public String getUserId() {
    return userId;
  }

  public UserSettings userId(String userId) {
    this.userId = userId;
    return this;
  }

  public Boolean getChatUsageEnabled() {
    return chatUsageEnabled;
  }

  public UserSettings chatUsageEnabled(Boolean chatUsageEnabled) {
    this.chatUsageEnabled = chatUsageEnabled;
    return this;
  }

  public Boolean getSharePresence() {
    return sharePresence;
  }

  public UserSettings sharePresence(Boolean sharePresence) {
    this.sharePresence = sharePresence;
    return this;
  }

  public Boolean getShowTypingNotification() {
    return showTypingNotification;
  }

  public UserSettings showTypingNotification(Boolean showTypingNotification) {
    this.showTypingNotification = showTypingNotification;
    return this;
  }

  public Boolean getChatConsentAsked() {
    return chatConsentAsked;
  }

  public UserSettings chatConsentAsked(Boolean chatConsentAsked) {
    this.chatConsentAsked = chatConsentAsked;
    return this;
  }

  public Boolean getShowReadConfirmation() {
    return showReadConfirmation;
  }

  public UserSettings showReadConfirmation(Boolean showReadConfirmation) {
    this.showReadConfirmation = showReadConfirmation;
    return this;
  }

  public Boolean getAccountDeactivated() {
    return accountDeactivated;
  }

  public UserSettings accountDeactivated(Boolean accountDeactivated) {
    this.accountDeactivated = accountDeactivated;
    return this;
  }

  public Boolean getAccountRegistered() {
    return accountRegistered;
  }

  public UserSettings accountRegistered(Boolean accountRegistered) {
    this.accountRegistered = accountRegistered;
    return this;
  }
}

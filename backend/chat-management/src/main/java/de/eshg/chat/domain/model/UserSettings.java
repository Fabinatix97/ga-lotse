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

  private boolean chatConsentAsked;
  private boolean accountRegistered;
  private boolean chatUsageEnabled;
  private boolean sharePresence;
  private boolean showTypingNotification;
  private boolean showReadConfirmation;
  private boolean accountDeactivated;

  public String getUserId() {
    return userId;
  }

  public UserSettings userId(String userId) {
    this.userId = userId;
    return this;
  }

  public UserSettings chatUsageEnabled(boolean chatUsageEnabled) {
    this.chatUsageEnabled = chatUsageEnabled;
    return this;
  }

  public UserSettings sharePresence(boolean sharePresence) {
    this.sharePresence = sharePresence;
    return this;
  }

  public UserSettings showTypingNotification(boolean showTypingNotification) {
    this.showTypingNotification = showTypingNotification;
    return this;
  }

  public UserSettings chatConsentAsked(boolean chatConsentAsked) {
    this.chatConsentAsked = chatConsentAsked;
    return this;
  }

  public UserSettings showReadConfirmation(boolean showReadConfirmation) {
    this.showReadConfirmation = showReadConfirmation;
    return this;
  }

  public UserSettings accountDeactivated(boolean accountDeactivated) {
    this.accountDeactivated = accountDeactivated;
    return this;
  }

  public UserSettings accountRegistered(Boolean accountRegistered) {
    this.accountRegistered = accountRegistered;
    return this;
  }

  public boolean isChatConsentAsked() {
    return chatConsentAsked;
  }

  public boolean isAccountRegistered() {
    return accountRegistered;
  }

  public boolean isChatUsageEnabled() {
    return chatUsageEnabled;
  }

  public boolean isSharePresence() {
    return sharePresence;
  }

  public boolean isShowTypingNotification() {
    return showTypingNotification;
  }

  public boolean isShowReadConfirmation() {
    return showReadConfirmation;
  }

  public boolean isAccountDeactivated() {
    return accountDeactivated;
  }
}

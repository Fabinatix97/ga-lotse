/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.keycloak;

import org.keycloak.representations.idm.RequiredActionProviderRepresentation;

public enum SecurityAction {
  UPDATE_PASSWORD("Update Password", false, false),
  CONFIGURE_TOTP("Configure OTP", false, false),
  TERMS_AND_CONDITIONS("Terms and Conditions", false, false),
  UPDATE_PROFILE("Update Profile", false, false),
  VERIFY_EMAIL("Verify Email", false, false),
  VERIFY_PROFILE("Verify Profile", false, false),
  DELETE_ACCOUNT("delete_account", "Delete Account", false, false),
  UPDATE_USER_LOCALE("update_user_locale", "Update User Locale", false, false),
  WEBAUTHN_REGISTER("webauthn-register", "Webauthn Register", false, false),
  WEBAUTHN_REGISTER_PASSWORDLESS(
      "webauthn-register-passwordless", "Webauthn Register Passwordless", false, false),
  ;

  private final String providerId;
  private final String name;
  private final boolean isEnabled;
  private final boolean isDefault;

  SecurityAction(String name, boolean isEnabled, boolean isDefault) {
    this.providerId = name();
    this.name = name;
    this.isEnabled = isEnabled;
    this.isDefault = isEnabled && isDefault;
  }

  SecurityAction(String providerId, String name, boolean isEnabled, boolean isDefault) {
    this.providerId = providerId;
    this.name = name;
    this.isEnabled = isEnabled;
    this.isDefault = isEnabled && isDefault;
  }

  public boolean isEnabled() {
    return isEnabled;
  }

  public boolean isDefault() {
    return isDefault;
  }

  public String getProviderId() {
    return providerId;
  }

  public String getDisplayName() {
    return name;
  }

  public int getPriority() {
    return 10 * ordinal() + 10;
  }

  public RequiredActionProviderRepresentation representation() {
    RequiredActionProviderRepresentation representation =
        new RequiredActionProviderRepresentation();
    representation.setPriority(getPriority());
    representation.setAlias(getProviderId());
    representation.setProviderId(getProviderId());
    representation.setName(getDisplayName());
    representation.setEnabled(isEnabled());
    representation.setDefaultAction(isDefault());
    return representation;
  }
}

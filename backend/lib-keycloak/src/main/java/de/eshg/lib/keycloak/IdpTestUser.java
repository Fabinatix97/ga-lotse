/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import java.util.List;
import java.util.Map;

public enum IdpTestUser implements KeycloakUser {
  MUK_DUMMY(
      "muk-dummy",
      "password",
      Map.of(
          "DatenuebermittlerPseudonymId",
          "du-1a23402e9bc4a3852f8ef1a23402e9bc4a3852f8ef",
          "Firmenname",
          "cronn GmbH",
          "Unternehmensanschrift",
          // hack to get complex MUK saml extension type (address) into SAMLResponse
          String.join(
              "\n",
              getMukSamlExtensionAttributeXml("Strasse", "Musterstraße"),
              getMukSamlExtensionAttributeXml("Hausnummer", "1"),
              getMukSamlExtensionAttributeXml("PLZ", "11011"),
              getMukSamlExtensionAttributeXml("Ort", "Berlin"),
              getMukSamlExtensionAttributeXml("Land", "DE"),
              getMukSamlExtensionAttributeXml("Adressergaenzung", "3. Stock"),
              getMukSamlExtensionAttributeXml("Typ", "INLAND")))),
  BUND_ID_DUMMY(
      "bund-id-dummy",
      "password",
      Map.ofEntries(
          Map.entry(
              "urn_oid_1.3.6.1.4.1.25484.494450.3",
              "bPK2-bereichsspezifisches-personenkennzeichen-1"),
          Map.entry("urn_oid_2.5.4.42", "Horst"),
          Map.entry("urn_oid_2.5.4.4", "Esser"),
          Map.entry(
              "urn_oid_0.9.2342.19200300.100.1.3",
              "horst.esser" + KeycloakUser.TEST_USER_EMAIL_POSTFIX),
          Map.entry("urn_oid_2.5.4.16", "Portlandweg 4"),
          Map.entry("urn_oid_2.5.4.17", "53227"),
          Map.entry("urn_oid_2.5.4.7", "Bonn"),
          Map.entry("urn_oid_1.2.40.0.10.2.1.1.225599", "DE"),
          Map.entry("urn_oid_0.9.2342.19200300.100.1.40", "Prof. Dr. Dr."),
          Map.entry("urn_oid_1.3.6.1.4.1.33592.1.3.5", "1"),
          Map.entry("urn_oid_1.2.40.0.10.2.1.1.55", "01.01.2000"),
          Map.entry("urn_oid_1.3.6.1.5.5.7.9.2", "Bonn"),
          Map.entry("urn_oid_1.2.40.0.10.2.1.1.225566", "Meyer"),
          Map.entry("urn_oid_2.5.4.20", "0123456789"))),
  ;

  private final String username;
  private final String password;
  private final Map<String, String> additionalAttributes;

  IdpTestUser(String username, String password, Map<String, String> additionalAttributes) {
    this.username = username;
    this.password = password;
    this.additionalAttributes = additionalAttributes;
  }

  @Override
  public String username() {
    return username;
  }

  @Override
  public String email() {
    return username + KeycloakUser.TEST_USER_EMAIL_POSTFIX;
  }

  @Override
  public String phoneNumber() {
    return null;
  }

  @Override
  public String externalChatUsername() {
    return null;
  }

  @Override
  public String firstName() {
    return null;
  }

  @Override
  public String lastName() {
    return null;
  }

  @Override
  public String password() {
    return password;
  }

  @Override
  public List<KeycloakRole> roles() {
    return List.of();
  }

  @Override
  public List<KeycloakGroup> groups() {
    return List.of();
  }

  @Override
  public Map<String, String> additionalAttributes() {
    return additionalAttributes;
  }

  public static String getMukSamlExtensionAttributeXml(String name, String value) {
    return "<ekona:%s xmlns:ekona=\"http://www.elster.de/schema/ekona/saml/extensions\">%s</ekona:%s>"
        .formatted(name, value, name);
  }
}

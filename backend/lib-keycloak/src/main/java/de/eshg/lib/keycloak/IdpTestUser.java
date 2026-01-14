/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import static de.eshg.lib.keycloak.IdpTestRealmUserAttribute.getNormalizedKey;

import java.util.List;
import java.util.Map;

public enum IdpTestUser implements KeycloakUser {
  MUK_DUMMY(
      "muk-dummy",
      "password",
      Map.of(
          MukUserAttribute.DATA_TRANSMITTER_PSEUDONYM_ID.getSamlName(),
          "du-1a23402e9bc4a3852f8ef1a23402e9bc4a3852f8ef",
          MukUserAttribute.FACILITY_NAME.getSamlName(),
          "cronn GmbH",
          MukUserAttribute.ADDRESS_COUNTRY.getSamlName(),
          // hack to get complex MUK saml extension type (address) into SAMLResponse
          String.join(
              "\n",
              getMukSamlExtensionAttributeXml(MukUserAttribute.ADDRESS_STREET, "Musterstraße"),
              getMukSamlExtensionAttributeXml(MukUserAttribute.ADDRESS_HOUSE_NUMBER, "1"),
              getMukSamlExtensionAttributeXml(MukUserAttribute.ADDRESS_POSTAL_CODE, "11011"),
              getMukSamlExtensionAttributeXml(MukUserAttribute.ADDRESS_CITY, "Berlin"),
              getMukSamlExtensionAttributeXml(MukUserAttribute.ADDRESS_COUNTRY, "DE"),
              getMukSamlExtensionAttributeXml(
                  MukUserAttribute.ADDRESS_ADDRESS_ADDITION, "3. Stock"),
              getMukSamlExtensionAttributeXml(MukUserAttribute.ADDRESS_TYPE, "INLAND")))),
  BUND_ID_DUMMY(
      "bund-id-dummy",
      "password",
      Map.ofEntries(
          Map.entry(
              getNormalizedKey(BundIdUserAttribute.B_PK_2),
              "bPK2-bereichsspezifisches-personenkennzeichen-1"),
          Map.entry(getNormalizedKey(BundIdUserAttribute.GIVEN_NAME), "Horst"),
          Map.entry(getNormalizedKey(BundIdUserAttribute.SURNAME), "Esser"),
          Map.entry(
              getNormalizedKey(BundIdUserAttribute.MAIL),
              "horst.esser" + KeycloakUser.TEST_USER_EMAIL_POSTFIX),
          Map.entry(getNormalizedKey(BundIdUserAttribute.POSTAL_ADDRESS), "Portlandweg 4"),
          Map.entry(getNormalizedKey(BundIdUserAttribute.POSTAL_CODE), "53227"),
          Map.entry(getNormalizedKey(BundIdUserAttribute.LOCALITY_NAME), "Bonn"),
          Map.entry(getNormalizedKey(BundIdUserAttribute.COUNTRY), "DE"),
          Map.entry(getNormalizedKey(BundIdUserAttribute.PERSONAL_TITLE), "Prof. Dr. Dr."),
          Map.entry(getNormalizedKey(BundIdUserAttribute.GENDER), "1"),
          Map.entry(getNormalizedKey(BundIdUserAttribute.BIRTH_DATE), "2000-01-01"),
          Map.entry(getNormalizedKey(BundIdUserAttribute.PLACE_OF_BIRTH), "Bonn"),
          Map.entry(getNormalizedKey(BundIdUserAttribute.BIRTH_NAME), "Meyer"),
          Map.entry(getNormalizedKey(BundIdUserAttribute.TELEPHONE_NUMBER), "0123456789"))),
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

  public static String getMukSamlExtensionAttributeXml(
      MukUserAttribute mukUserAttribute, String value) {
    String name = mukUserAttribute.getNestedSamlName();
    return "<ekona:%s xmlns:ekona=\"http://www.elster.de/schema/ekona/saml/extensions\">%s</ekona:%s>"
        .formatted(name, value, name);
  }
}

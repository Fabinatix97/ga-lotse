/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import static de.eshg.lib.keycloak.CitizenUserAttribute.BUND_ID_BIRTH_DATE;
import static de.eshg.lib.keycloak.CitizenUserAttribute.BUND_ID_BIRTH_NAME;
import static de.eshg.lib.keycloak.CitizenUserAttribute.BUND_ID_B_PK_2;
import static de.eshg.lib.keycloak.CitizenUserAttribute.BUND_ID_COUNTRY;
import static de.eshg.lib.keycloak.CitizenUserAttribute.BUND_ID_GENDER;
import static de.eshg.lib.keycloak.CitizenUserAttribute.BUND_ID_LOCALITY_NAME;
import static de.eshg.lib.keycloak.CitizenUserAttribute.BUND_ID_PERSONAL_TITLE;
import static de.eshg.lib.keycloak.CitizenUserAttribute.BUND_ID_PLACE_OF_BIRTH;
import static de.eshg.lib.keycloak.CitizenUserAttribute.BUND_ID_POSTAL_ADDRESS;
import static de.eshg.lib.keycloak.CitizenUserAttribute.BUND_ID_POSTAL_CODE;
import static de.eshg.lib.keycloak.CitizenUserAttribute.BUND_ID_TELEPHONE_NUMBER;
import static de.eshg.lib.keycloak.CitizenUserAttribute.MUK_ADDRESS_ADDRESS_ADDITION;
import static de.eshg.lib.keycloak.CitizenUserAttribute.MUK_ADDRESS_CITY;
import static de.eshg.lib.keycloak.CitizenUserAttribute.MUK_ADDRESS_COUNTRY;
import static de.eshg.lib.keycloak.CitizenUserAttribute.MUK_ADDRESS_HOUSE_NUMBER;
import static de.eshg.lib.keycloak.CitizenUserAttribute.MUK_ADDRESS_POSTAL_CODE;
import static de.eshg.lib.keycloak.CitizenUserAttribute.MUK_ADDRESS_STREET;
import static de.eshg.lib.keycloak.CitizenUserAttribute.MUK_DATA_TRANSMITTER_PSEUDONYM_ID;
import static de.eshg.lib.keycloak.CitizenUserAttribute.MUK_FACILITY_NAME;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public enum CitizenTestUser implements KeycloakUser {
  CITIZEN("citizen", "password", "Max", "Mustermann", List.of(), Map.of()),
  MUK_DUMMY_USER(
      "muk-dummy-user",
      "password",
      "MUK",
      "USER",
      List.of(CitizenPermissionRole.MUK_USER),
      Map.of(
          MUK_DATA_TRANSMITTER_PSEUDONYM_ID,
          "du-986b2b54ab89cf4ed674ad8c3126b966b54d4872",
          MUK_FACILITY_NAME,
          "Test GmbH",
          MUK_ADDRESS_STREET,
          "Test Straße",
          MUK_ADDRESS_HOUSE_NUMBER,
          "Test Nr",
          MUK_ADDRESS_POSTAL_CODE,
          "Test PLZ",
          MUK_ADDRESS_CITY,
          "Test Stadt",
          MUK_ADDRESS_ADDRESS_ADDITION,
          "EG",
          MUK_ADDRESS_COUNTRY,
          "DE")),
  MUK_DUMMY_USER_MINIMAL(
      "muk-dummy-user-minimal",
      "password",
      "MINIMAL",
      "MUK USER",
      List.of(CitizenPermissionRole.MUK_USER),
      Map.of(
          MUK_DATA_TRANSMITTER_PSEUDONYM_ID, "4f-c2b94d217d8d399a142d85c593e17c98b4b91",
          MUK_FACILITY_NAME, "Andorra Test Facility",
          MUK_ADDRESS_STREET, "Avinguda de Meritxell",
          MUK_ADDRESS_CITY, "Andorra la Vella")),
  MUK_DUMMY_USER_MISSING_ATTRIBUTES(
      "muk-dummy-user-missing-attributes",
      "password",
      "MUK User",
      "with missing attributes",
      List.of(CitizenPermissionRole.MUK_USER),
      Map.of(MUK_DATA_TRANSMITTER_PSEUDONYM_ID, "9d-e7a52b3a47d7b129b834d1c745f6c78d98a2b0")),
  MUK_DUMMY_USER_FOR_LENGTH_RESTRICTIONS(
      "muk-dummy-user-for-length-restrictions",
      "password",
      "MUK",
      "USER",
      List.of(CitizenPermissionRole.MUK_USER),
      Map.of(
          MUK_DATA_TRANSMITTER_PSEUDONYM_ID, "du-986b2b54ab89cf4ed674ad8c3126b966b54d4872",
          MUK_FACILITY_NAME, "Test GmbH",
          MUK_ADDRESS_STREET,
              "Friedrichstraße 1234, Gebäude 5678, Apartment 91011, Block 12, Etage 34",
          MUK_ADDRESS_HOUSE_NUMBER,
              "Friedrichstraße 1234, Gebäude 5678, Apartment 91011, Block 12, Etage 34",
          MUK_ADDRESS_POSTAL_CODE, "Test PLZ",
          MUK_ADDRESS_CITY,
              "Friedrichstraße 1234, Gebäude 5678, Apartment 91011, Block 12, Etage 34",
          MUK_ADDRESS_COUNTRY, "DE")),
  BUND_ID_DUMMY_USER(
      "bund-id-dummy-user",
      "password",
      "BundId",
      "User",
      List.of(CitizenPermissionRole.BUND_ID_USER),
      Map.ofEntries(
          Map.entry(BUND_ID_B_PK_2, "a_iGbROEXA1929XK2feAgOUjdzfp2UsDaNofeI5pocv4"),
          Map.entry(BUND_ID_POSTAL_ADDRESS, "Test Straße 23A"),
          Map.entry(BUND_ID_POSTAL_CODE, "12345"),
          Map.entry(BUND_ID_LOCALITY_NAME, "Test Wohnort"),
          Map.entry(BUND_ID_COUNTRY, "DE"),
          Map.entry(BUND_ID_GENDER, "Male"),
          Map.entry(BUND_ID_BIRTH_DATE, "1975-03-23"),
          Map.entry(BUND_ID_PLACE_OF_BIRTH, "Test Geburtsort DE"),
          Map.entry(BUND_ID_BIRTH_NAME, "Test Geburtsname"),
          Map.entry(BUND_ID_TELEPHONE_NUMBER, "+49 432 123456"),
          Map.entry(BUND_ID_PERSONAL_TITLE, "Dr"))),
  BUND_ID_DUMMY_USER_MINIMAL(
      "bund-id-dummy-user-minimal",
      "password",
      "Minimal",
      "BundId USER",
      List.of(CitizenPermissionRole.BUND_ID_USER),
      Map.of(
          BUND_ID_B_PK_2,
          "x_AbcD9kLmNzQ3pT8v0zJxRUp7wL6eIjF1wKq4mOaV",
          BUND_ID_POSTAL_ADDRESS,
          "Mörkvägen 7",
          BUND_ID_POSTAL_CODE,
          "86345",
          BUND_ID_LOCALITY_NAME,
          "Sundsvall",
          BUND_ID_BIRTH_DATE,
          "1987-04-03",
          BUND_ID_PLACE_OF_BIRTH,
          "Sundsvall/ Västernorrland")),
  BUND_ID_USER_MISSING_ATTRIBUTES(
      "bund-id-dummy-user-missing-attributes",
      "password",
      "BundId User",
      "with missing attributes",
      List.of(CitizenPermissionRole.BUND_ID_USER),
      Map.of(BUND_ID_B_PK_2, "b_wRtPLOPZ7483YN5hfBqKVjdxs1XpTnQwSgL8yFuzm9")),
  BUND_ID_USER_FOR_LENGTH_RESTRICTIONS(
      "bund-id-dummy-user-for-length-restrictions",
      "password",
      "Gustav-Försvarare-Van-Dalarna-Kallraven-Vinterstjärna-Mörkström-Ödesprins-På-Himlens-Berget-Månlys-Vägfarare-Från-Frostdal-Vid-Stormhaven",
      "Skogsdal-Himmelriksdahl-Vinterström-Stormvakt-Mörkberg-Frostvåg-Nordlunds-Kallvik-Kapellgrensson-Vägenfrån-Mörka-Ödelandskap-Sjöforsens-Hjärtskog",
      List.of(CitizenPermissionRole.BUND_ID_USER),
      Map.ofEntries(
          Map.entry(BUND_ID_B_PK_2, "OKYUQ-yFYLC1Qhp770Sy8wI8OvzI8348CFovB_Ay_PU"),
          Map.entry(BUND_ID_POSTAL_ADDRESS, "Isgatan 134124436545623"),
          Map.entry(
              BUND_ID_POSTAL_CODE,
              "Isgatan 134124436545623 Lägenhet 3, Kallskogen vid Stormyrarna, 95213 Vinterdal"),
          Map.entry(
              BUND_ID_LOCALITY_NAME,
              "Isgatan 134124436545623 Lägenhet 3, Kallskogen vid Stormyrarna, 95213 Vinterdal"),
          Map.entry(BUND_ID_COUNTRY, "SE"),
          Map.entry(BUND_ID_GENDER, "Male"),
          Map.entry(BUND_ID_BIRTH_DATE, "1975-03-23"),
          Map.entry(
              BUND_ID_PLACE_OF_BIRTH,
              "Isgatan 134 Lägenhet 3, Kallskogen vid Stormyrarna, 95213 Vinterdal"),
          Map.entry(BUND_ID_BIRTH_NAME, "With length restrictions"),
          Map.entry(BUND_ID_TELEPHONE_NUMBER, "012345678901234567890123456789"),
          Map.entry(
              BUND_ID_PERSONAL_TITLE,
              "Vorbestehender Schattenmeister der gefrorenen Sümpfe und Wälder von Mörkdal, oberster Hüter der Nachtgeister und temporärer Führer der Eisbären von Vinterdal"))),
  USER_WITH_MUK_AND_BUND_ID_ROLES_ONLY(
      "authorized-only-user",
      "password",
      "Cititen user",
      "with bundId and Muk Roles only",
      List.of(CitizenPermissionRole.BUND_ID_USER, CitizenPermissionRole.MUK_USER),
      Map.of());

  private final String username;
  private final String email;
  private final String password;
  private final String firstName;
  private final String lastName;
  private final List<KeycloakRole> roles;
  private final Map<String, String> additionalAttributes;

  CitizenTestUser(
      String username,
      String password,
      String firstName,
      String lastName,
      List<CitizenPermissionRole> roles,
      Map<CitizenUserAttribute, String> additionalAttributes) {
    this.username = username;
    this.email = username + TEST_USER_EMAIL_POSTFIX;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.roles = new ArrayList<>(roles);

    this.additionalAttributes = new HashMap<>();
    for (Map.Entry<CitizenUserAttribute, String> entry : additionalAttributes.entrySet()) {
      CitizenUserAttribute citizenUserAttribute = entry.getKey();
      this.additionalAttributes.put(citizenUserAttribute.getKey(), entry.getValue());
    }
  }

  @Override
  public String username() {
    return username;
  }

  @Override
  public String email() {
    return email;
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
  public String password() {
    return password;
  }

  public UsernamePassword getUsernamePassword() {
    return new UsernamePassword(username, password, Realm.CITIZENS);
  }

  @Override
  public String firstName() {
    return firstName;
  }

  @Override
  public String lastName() {
    return lastName;
  }

  @Override
  public List<KeycloakRole> roles() {
    return roles;
  }

  @Override
  public List<KeycloakGroup> groups() {
    return List.of();
  }

  @Override
  public Map<String, String> additionalAttributes() {
    return additionalAttributes;
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import java.util.ArrayList;
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
          "muk.dataTransmitterPseudonymId",
          "du-986b2b54ab89cf4ed674ad8c3126b966b54d4872",
          "muk.facilityName",
          "Test GmbH",
          "muk.address.street",
          "Test Straße",
          "muk.address.houseNumber",
          "Test Nr",
          "muk.address.postalCode",
          "Test PLZ",
          "muk.address.city",
          "Test Stadt",
          "muk.address.addition",
          "EG",
          "muk.address.country",
          "DE")),
  MUK_DUMMY_USER_MINIMAL(
      "muk-dummy-user-minimal",
      "password",
      "MINIMAL",
      "MUK USER",
      List.of(CitizenPermissionRole.MUK_USER),
      Map.of(
          "muk.dataTransmitterPseudonymId",
          "4f-c2b94d217d8d399a142d85c593e17c98b4b91",
          "muk.facilityName",
          "Andorra Test Facility",
          "muk.address.street",
          "Avinguda de Meritxell",
          "muk.address.city",
          "Andorra la Vella",
          "muk.address.country",
          "AD")),
  MUK_DUMMY_USER_MISSING_ATTRIBUTES(
      "muk-dummy-user-missing-attributes",
      "password",
      "MUK User",
      "with missing attributes",
      List.of(CitizenPermissionRole.MUK_USER),
      Map.of()),
  MUK_DUMMY_USER_FOR_LENGTH_RESTRICTIONS(
      "muk-dummy-user-for-length-restrictions",
      "password",
      "MUK",
      "USER",
      List.of(CitizenPermissionRole.MUK_USER),
      Map.of(
          "muk.dataTransmitterPseudonymId",
          "du-986b2b54ab89cf4ed674ad8c3126b966b54d4872",
          "muk.facilityName",
          "Test GmbH",
          "muk.address.street",
          "Friedrichstraße 1234, Gebäude 5678, Apartment 91011, Block 12, Etage 34",
          "muk.address.houseNumber",
          "Friedrichstraße 1234, Gebäude 5678, Apartment 91011, Block 12, Etage 34",
          "muk.address.postalCode",
          "Test PLZ",
          "muk.address.city",
          "Friedrichstraße 1234, Gebäude 5678, Apartment 91011, Block 12, Etage 34",
          "muk.address.country",
          "DE")),
  BUND_ID_USER(
      "de93489238",
      "password",
      "BundId",
      "User",
      List.of(CitizenPermissionRole.BUND_ID_USER),
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
      Map<String, String> additionalAttributes) {
    this.username = username;
    this.email = username + TEST_USER_EMAIL_POSTFIX;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.roles = new ArrayList<>(roles);
    this.additionalAttributes = additionalAttributes;
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

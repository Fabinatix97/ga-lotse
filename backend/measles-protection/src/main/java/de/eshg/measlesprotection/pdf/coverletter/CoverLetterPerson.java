/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.pdf.coverletter;

public record CoverLetterPerson(
    String salutation,
    String firstName,
    String lastName,
    String street,
    String postalCode,
    String city,
    String custodianClause) {

  public CoverLetterPerson(
      String salutation,
      String firstName,
      String lastName,
      String street,
      String postalCode,
      String city) {
    this(salutation, firstName, lastName, street, postalCode, city, "");
  }
}

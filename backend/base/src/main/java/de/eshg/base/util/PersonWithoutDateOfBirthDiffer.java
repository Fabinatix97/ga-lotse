/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import de.eshg.base.address.persistence.entity.Address;
import de.eshg.base.centralfile.persistence.entity.*;
import org.apache.commons.lang3.builder.DiffBuilder;
import org.apache.commons.lang3.builder.DiffResult;
import org.apache.commons.lang3.builder.ToStringStyle;

public class PersonWithoutDateOfBirthDiffer extends AbstractDiffer {

  private PersonWithoutDateOfBirthDiffer() {}

  public static boolean isPersonMatch(
      PersonWithoutDateOfBirth personFileState, PersonWithoutDateOfBirth referencePerson) {
    DiffResult<PersonWithoutDateOfBirth> personDetailsDiff =
        PersonWithoutDateOfBirthDiffer.diff(personFileState, referencePerson);
    if (personDetailsDiff.getNumberOfDiffs() != 0) {
      return false;
    }
    DiffResult<? extends Address> contactAddressDiff =
        diff(personFileState.getContactAddress(), referencePerson.getContactAddress());
    return contactAddressDiff.getNumberOfDiffs() == 0;
  }

  public static DiffResult<PersonWithoutDateOfBirth> diff(
      PersonWithoutDateOfBirth lhs, PersonWithoutDateOfBirth rhs) {
    PersonWithoutDateOfBirth left = lhs != null ? lhs : new PersonWithoutDateOfBirth();
    PersonWithoutDateOfBirth right = rhs != null ? rhs : new PersonWithoutDateOfBirth();
    return new DiffBuilder.Builder<PersonWithoutDateOfBirth>()
        .setLeft(left)
        .setRight(right)
        .setStyle(ToStringStyle.SHORT_PREFIX_STYLE)
        .build()
        .append("title", trim(left.getTitle()), trim(right.getTitle()))
        .append("salutation", left.getSalutation(), right.getSalutation())
        .append("gender", left.getGender(), right.getGender())
        .append("firstName", trim(left.getFirstName()), trim(right.getFirstName()))
        .append("lastName", trim(left.getLastName()), trim(right.getLastName()))
        .append("emailAddresses", collectEmailAddresses(left), collectEmailAddresses(right))
        .append("phoneNumbers", collectPhoneNumbers(left), collectPhoneNumbers(right))
        .build();
  }

  private static String[] collectPhoneNumbers(PersonWithoutDateOfBirth person) {
    return person.getPhoneNumbers().stream()
        .map(PersonWithoutDateOfBirthPhoneNumber::getPhoneNumber)
        .toArray(String[]::new);
  }

  private static String[] collectEmailAddresses(PersonWithoutDateOfBirth person) {
    return person.getEmailAddresses().stream()
        .map(PersonWithoutDateOfBirthEmailAddress::getEmailAddress)
        .toArray(String[]::new);
  }
}

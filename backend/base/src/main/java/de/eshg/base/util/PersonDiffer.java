/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import de.eshg.base.address.persistence.entity.Address;
import de.eshg.base.centralfile.persistence.entity.*;
import org.apache.commons.lang3.builder.DiffBuilder;
import org.apache.commons.lang3.builder.DiffResult;
import org.apache.commons.lang3.builder.ToStringStyle;

public class PersonDiffer extends AbstractDiffer {

  private PersonDiffer() {}

  public static boolean isPersonMatch(Person personFileState, Person referencePerson) {
    DiffResult<Person> personDetailsDiff = PersonDiffer.diff(personFileState, referencePerson);
    if (personDetailsDiff.getNumberOfDiffs() != 0) {
      return false;
    }
    DiffResult<? extends Address> contactAddressDiff =
        diff(personFileState.getContactAddress(), referencePerson.getContactAddress());
    if (contactAddressDiff.getNumberOfDiffs() != 0) {
      return false;
    }
    DiffResult<? extends Address> billingAddressDiff =
        diff(
            personFileState.getDifferentBillingAddress(),
            referencePerson.getDifferentBillingAddress());
    return billingAddressDiff.getNumberOfDiffs() == 0;
  }

  public static DiffResult<Person> diff(Person lhs, Person rhs) {
    Person left = lhs != null ? lhs : new Person();
    Person right = rhs != null ? rhs : new Person();
    BirthDetails leftBirthDetails =
        left.getBirthDetails() == null ? new BirthDetails(null) : left.getBirthDetails();
    BirthDetails rightBirthDetails =
        right.getBirthDetails() == null ? new BirthDetails(null) : right.getBirthDetails();
    return new DiffBuilder.Builder<Person>()
        .setLeft(left)
        .setRight(right)
        .setStyle(ToStringStyle.SHORT_PREFIX_STYLE)
        .build()
        .append("title", trim(left.getTitle()), trim(right.getTitle()))
        .append("salutation", left.getSalutation(), right.getSalutation())
        .append("gender", left.getGender(), right.getGender())
        .append("firstName", trim(left.getFirstName()), trim(right.getFirstName()))
        .append("lastName", trim(left.getLastName()), trim(right.getLastName()))
        .append("dateOfBirth", leftBirthDetails.dateOfBirth(), rightBirthDetails.dateOfBirth())
        .append(
            "placeOfBirth",
            trim(leftBirthDetails.placeOfBirth()),
            trim(rightBirthDetails.placeOfBirth()))
        .append(
            "nameAtBirth",
            trim(leftBirthDetails.nameAtBirth()),
            trim(rightBirthDetails.nameAtBirth()))
        .append(
            "countryOfBirth", leftBirthDetails.countryOfBirth(), rightBirthDetails.countryOfBirth())
        .append("emailAddresses", collectEmailAddresses(left), collectEmailAddresses(right))
        .append("phoneNumbers", collectPhoneNumbers(left), collectPhoneNumbers(right))
        .build();
  }

  private static String[] collectPhoneNumbers(Person person) {
    return person.getPhoneNumbers().stream()
        .map(PersonPhoneNumber::getPhoneNumber)
        .toArray(String[]::new);
  }

  private static String[] collectEmailAddresses(Person person) {
    return person.getEmailAddresses().stream()
        .map(PersonEmailAddress::getEmailAddress)
        .toArray(String[]::new);
  }
}

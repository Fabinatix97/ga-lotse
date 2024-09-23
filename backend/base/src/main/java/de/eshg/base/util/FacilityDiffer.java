/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import de.eshg.base.centralfile.persistence.entity.*;
import java.util.List;
import java.util.Optional;
import org.apache.commons.lang3.builder.DiffBuilder;
import org.apache.commons.lang3.builder.DiffResult;
import org.apache.commons.lang3.builder.ToStringStyle;

public class FacilityDiffer extends AbstractDiffer {

  public static DiffResult<Facility> diff(Facility lhs, Facility rhs) {
    Facility left = lhs != null ? lhs : new Facility();
    Facility right = rhs != null ? rhs : new Facility();

    return new DiffBuilder<>(left, right, ToStringStyle.SHORT_PREFIX_STYLE)
        .append("name", trim(left.getName()), trim(right.getName()))
        .append("emailAddress", collectEmailAddresses(left), collectEmailAddresses(right))
        .append("phoneNumbers", collectPhoneNumbers(left), collectPhoneNumbers(right))
        .build();
  }

  private static String[] collectPhoneNumbers(Facility facility) {
    return facility.getPhoneNumbers().stream()
        .map(FacilityPhoneNumber::getPhoneNumber)
        .toArray(String[]::new);
  }

  private static String[] collectEmailAddresses(Facility facility) {
    return facility.getEmailAddresses().stream()
        .map(FacilityEmailAddress::getEmailAddress)
        .toArray(String[]::new);
  }

  public static FacilityContactPersonsDiffWrapper removeMatchingPairs(
      List<FacilityContactPerson> fileStateContactPersons,
      List<FacilityContactPerson> referenceContactPersons) {
    List<FacilityContactPerson> newLeftList =
        fileStateContactPersons.stream()
            .filter(l -> !removeMatchingContactPerson(l, referenceContactPersons))
            .toList();
    return new FacilityContactPersonsDiffWrapper(newLeftList, referenceContactPersons);
  }

  private static boolean removeMatchingContactPerson(
      FacilityContactPerson facilityContactPerson,
      List<FacilityContactPerson> facilityContactPersonList) {
    Optional<FacilityContactPerson> matchingElement =
        facilityContactPersonList.stream()
            .filter(a -> FacilityMatcher.isContactPersonMatch(a, facilityContactPerson))
            .findFirst();

    return matchingElement.map(facilityContactPersonList::remove).orElse(false);
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import static de.eshg.base.util.AddressMatcher.isAddressMatch;

import de.eshg.base.centralfile.persistence.entity.Facility;
import de.eshg.base.centralfile.persistence.entity.FacilityAddress;
import de.eshg.base.centralfile.persistence.entity.FacilityContactPerson;
import de.eshg.base.centralfile.persistence.entity.FacilityEmailAddress;
import de.eshg.base.centralfile.persistence.entity.FacilityPhoneNumber;
import java.util.List;
import org.apache.commons.lang3.StringUtils;

public class FacilityMatcher {

  private FacilityMatcher() {}

  public static boolean isFacilityMatch(
      Facility referenceFacility, Facility facilityFileState, boolean compareMainContact) {
    return isFacilityMatch(
        referenceFacility,
        facilityFileState.getName(),
        facilityFileState.getPhoneNumbers(),
        facilityFileState.getEmailAddresses(),
        facilityFileState.getContactPersons(),
        facilityFileState.getContactAddress(),
        facilityFileState.getDifferentBillingAddress(),
        compareMainContact);
  }

  public static boolean isFacilityMatch(
      Facility referenceFacility,
      String name,
      List<FacilityPhoneNumber> phoneNumbers,
      List<FacilityEmailAddress> emailAddresses,
      List<FacilityContactPerson> contactPersons,
      FacilityAddress contactAddress,
      FacilityAddress differentBillingAddress,
      boolean compareMainContact) {
    return StringUtils.equals(referenceFacility.getName(), name)
        && isFacilityPhoneNumberListUnchanged(referenceFacility.getPhoneNumbers(), phoneNumbers)
        && isFacilityEmailAddressListUnchanged(
            referenceFacility.getEmailAddresses(), emailAddresses)
        && isFacilityContactPersonsListMatching(
            referenceFacility.getContactPersons(), contactPersons, compareMainContact)
        && isAddressMatch(referenceFacility.getContactAddress(), contactAddress)
        && isAddressMatch(referenceFacility.getDifferentBillingAddress(), differentBillingAddress);
  }

  private static boolean isFacilityEmailAddressListUnchanged(
      List<FacilityEmailAddress> referenceEmailAddresses,
      List<FacilityEmailAddress> emailAddresses) {
    return MatcherUtil.isListEqualUnordered(
        referenceEmailAddresses, emailAddresses, FacilityMatcher::isFacilityEmailAddressMatch);
  }

  private static boolean isFacilityEmailAddressMatch(
      FacilityEmailAddress referenceEmailAddress, FacilityEmailAddress emailAddress) {
    return StringUtils.equals(
        referenceEmailAddress.getEmailAddress(), emailAddress.getEmailAddress());
  }

  private static boolean isFacilityPhoneNumberListUnchanged(
      List<FacilityPhoneNumber> referencePhoneNumbers, List<FacilityPhoneNumber> phoneNumbers) {
    return MatcherUtil.isListEqualUnordered(
        referencePhoneNumbers, phoneNumbers, FacilityMatcher::isFacilityPhoneNumberMatch);
  }

  private static boolean isFacilityPhoneNumberMatch(
      FacilityPhoneNumber referencePhoneNumber, FacilityPhoneNumber phoneNumber) {
    return StringUtils.equals(referencePhoneNumber.getPhoneNumber(), phoneNumber.getPhoneNumber());
  }

  public static boolean isFacilityContactPersonsListMatching(
      List<FacilityContactPerson> referenceContactPersons,
      List<FacilityContactPerson> fileStateContactPersons,
      boolean compareMainContact) {

    return MatcherUtil.isListEqualUnordered(
        referenceContactPersons,
        fileStateContactPersons,
        (p1, p2) -> isContactPersonMatch(p1, p2, compareMainContact));
  }

  public static boolean isContactPersonMatch(
      FacilityContactPerson referenceContactPerson,
      FacilityContactPerson fileStateContactPerson,
      boolean compareMainContact) {
    return StringUtils.equals(referenceContactPerson.getRole(), fileStateContactPerson.getRole())
        && StringUtils.equals(
            referenceContactPerson.getFirstName(), fileStateContactPerson.getFirstName())
        && StringUtils.equals(
            referenceContactPerson.getLastName(), fileStateContactPerson.getLastName())
        && StringUtils.equals(referenceContactPerson.getTitle(), fileStateContactPerson.getTitle())
        && StringUtils.equals(
            referenceContactPerson.getEmailAddress(), fileStateContactPerson.getEmailAddress())
        && StringUtils.equals(
            referenceContactPerson.getPhoneNumber(), fileStateContactPerson.getPhoneNumber())
        && referenceContactPerson.getSalutation() == fileStateContactPerson.getSalutation()
        && referenceContactPerson.getGender() == fileStateContactPerson.getGender()
        && (!compareMainContact
            || referenceContactPerson.isMainContact() == fileStateContactPerson.isMainContact());
  }

  public static boolean isContactPersonMatchNameMatch(
      FacilityContactPerson referenceContactPerson, FacilityContactPerson fileStateContactPerson) {
    return StringUtils.equals(
            referenceContactPerson.getFirstName(), fileStateContactPerson.getFirstName())
        && StringUtils.equals(
            referenceContactPerson.getLastName(), fileStateContactPerson.getLastName());
  }
}

/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.importer;

import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.centralfile.api.facility.FacilityContactPersonDto;
import de.eshg.base.centralfile.api.facility.FacilityDetailsDto;
import de.eshg.base.centralfile.api.facility.GetReferenceFacilityResponse;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.function.BiPredicate;

class FacilityDtoMatcher {

  private FacilityDtoMatcher() {}

  /**
   * Compares a base reference facility with imported facility data; returns true iff both are
   * recognized as being the same facility. The following fields get compared:
   *
   * <ul>
   *   <li>{@code name}
   *   <li>{@code contactAddress.country}
   *   <li>{@code contactAddress.city}
   *   <li>{@code contactAddress.postalCode}
   *   <li>{@code contactAddress.street}
   *   <li>{@code contactAddress.houseNumber}
   *   <li>{@code contactAddress.postbox},
   * </ul>
   *
   * Note that {@code contactAddress.differentName} and {@code contact.addressAddition} are not
   * compared because they cannot be imported.
   *
   * <p>The fields are compared for <i>exact equality</i>.
   */
  public static boolean isFacilityMatch(
      GetReferenceFacilityResponse referenceFacility, FacilityDetailsDto importData) {
    return Objects.equals(referenceFacility.name(), importData.name())
        && isAddressMatch(referenceFacility.contactAddress(), importData.contactAddress());
  }

  /** Currently unused, but can be used later to compare <i>all imported fields</i>. */
  public static boolean isEqualRegardingAllImportedFields(
      GetReferenceFacilityResponse referenceFacility, FacilityDetailsDto importData) {
    return isFacilityMatch(referenceFacility, importData)
        && isFacilityPhoneNumberListUnchanged(
            referenceFacility.phoneNumbers(), importData.phoneNumbers())
        && isFacilityEmailAddressListUnchanged(
            referenceFacility.emailAddresses(), importData.emailAddresses())
        && isFacilityContactPersonsListMatching(
            referenceFacility.contactPersons(), importData.contactPersons());
  }

  private static boolean isFacilityEmailAddressListUnchanged(
      List<String> referenceEmailAddresses, List<String> emailAddresses) {
    return isEqualIgnoringOrder(referenceEmailAddresses, emailAddresses);
  }

  private static boolean isFacilityPhoneNumberListUnchanged(
      List<String> referencePhoneNumbers, List<String> phoneNumbers) {
    return isEqualIgnoringOrder(referencePhoneNumbers, phoneNumbers);
  }

  private static boolean isFacilityContactPersonsListMatching(
      List<FacilityContactPersonDto> referenceContactPersons,
      List<FacilityContactPersonDto> fileStateContactPersons) {
    return isEqualIgnoringOrder(
        referenceContactPersons, fileStateContactPersons, FacilityDtoMatcher::isContactPersonMatch);
  }

  private static boolean isContactPersonMatch(
      FacilityContactPersonDto contactPerson1, FacilityContactPersonDto contactPerson2) {
    // could probably be shortened to `Object.equals(contactPerson1, contactPerson2)`
    // but we don't know if someone adds non-comparable attributes to the record.
    return Objects.equals(contactPerson1.role(), contactPerson2.role())
        && Objects.equals(contactPerson1.firstName(), contactPerson2.firstName())
        && Objects.equals(contactPerson1.lastName(), contactPerson2.lastName())
        && Objects.equals(contactPerson1.title(), contactPerson2.title())
        && Objects.equals(contactPerson1.emailAddress(), contactPerson2.emailAddress())
        && Objects.equals(contactPerson1.phoneNumber(), contactPerson2.phoneNumber())
        && isSalutationEqual(contactPerson1.salutation(), contactPerson2.salutation());
  }

  /** As a special case, {@code NOT_SPECIFIED} matches {@code null}. */
  private static boolean isSalutationEqual(SalutationDto salutation1, SalutationDto salutation2) {
    if (salutation1 == null && salutation2 == SalutationDto.NOT_SPECIFIED) return true;
    if (salutation2 == null && salutation1 == SalutationDto.NOT_SPECIFIED) return true;
    return Objects.equals(salutation1, salutation2);
  }

  private static boolean isAddressMatch(AddressDto referenceAddress, AddressDto importAddress) {
    return switch (referenceAddress) {
      case null -> importAddress == null;
      case DomesticAddressDto domesticAddress ->
          isDomesticAddressMatch(domesticAddress, importAddress);
      case PostboxAddressDto postboxAddress -> isPostboxAddressMatch(postboxAddress, importAddress);
    };
  }

  private static boolean isCommonAttributesMatch(
      AddressDto referenceAddress, AddressDto importAddress) {
    return Objects.equals(referenceAddress.country(), importAddress.country())
        && Objects.equals(referenceAddress.city(), importAddress.city())
        && Objects.equals(referenceAddress.postalCode(), importAddress.postalCode());
  }

  private static boolean isDomesticAddressMatch(
      DomesticAddressDto domesticAddress, AddressDto importAddress) {
    return importAddress instanceof DomesticAddressDto importDomesticAddress
        && isCommonAttributesMatch(domesticAddress, importDomesticAddress)
        && Objects.equals(domesticAddress.street(), importDomesticAddress.street())
        && Objects.equals(domesticAddress.houseNumber(), importDomesticAddress.houseNumber());
  }

  private static boolean isPostboxAddressMatch(
      PostboxAddressDto postboxAddress, AddressDto importAddress) {
    return importAddress instanceof PostboxAddressDto importPostboxAddress
        && isCommonAttributesMatch(postboxAddress, importPostboxAddress)
        && Objects.equals(postboxAddress.postbox(), importPostboxAddress.postbox());
  }

  private static <T> boolean isEqualIgnoringOrder(Collection<T> col1, Collection<T> col2) {
    return isEqualIgnoringOrder(col1, col2, Objects::equals);
  }

  private static <T> boolean isEqualIgnoringOrder(
      Collection<T> col1, Collection<T> col2, BiPredicate<T, T> isEqual) {
    if (col1.size() != col2.size()) return false;
    return col1.stream().allMatch(c1 -> col2.stream().anyMatch(c2 -> isEqual.test(c1, c2)));
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf;

import com.google.common.base.Strings;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.contact.api.InstitutionContactDto;
import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.lib.contact.ContactClient;
import de.eshg.schoolentry.client.DepartmentInfoClient;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.springframework.util.Assert;

public abstract class AbstractGenerator {

  private final ContactClient contactClient;
  private final DepartmentInfoClient departmentInfoClient;

  protected AbstractGenerator(
      DepartmentInfoClient departmentInfoClient, ContactClient contactClient) {
    this.departmentInfoClient = departmentInfoClient;
    this.contactClient = contactClient;
  }

  protected Address getDepartmentAddress() {
    GetDepartmentInfoResponse departmentInfo = departmentInfoClient.getDepartmentInfo();
    return new Address(
        departmentInfo.name(),
        concat(departmentInfo.street(), departmentInfo.houseNumber()),
        departmentInfo.postalCode(),
        departmentInfo.city(),
        List.of(departmentInfo.phoneNumber()),
        departmentInfo.homepage(),
        null,
        List.of(departmentInfo.email()));
  }

  protected Address getAddressOfInstitution(UUID institutionLocationId) {
    ContactDto institution = contactClient.getContact(institutionLocationId);

    Assert.notNull(institution, () -> "Institution contact must not be null");
    Assert.isInstanceOf(
        InstitutionContactDto.class,
        institution,
        () -> "Function must only be used to retrieve institution contacts");
    return switch (institution.contactAddress()) {
      case DomesticAddressDto domesticAddress ->
          new Address(
              institution.name(),
              concat(domesticAddress.street(), domesticAddress.houseNumber()),
              domesticAddress.postalCode(),
              domesticAddress.city(),
              institution.phoneNumbers(),
              null,
              domesticAddress.addressAddition(),
              institution.emailAddresses());
      case PostboxAddressDto postboxAddress ->
          new Address(
              postboxAddress.postbox(),
              postboxAddress.differentName(),
              postboxAddress.postalCode(),
              postboxAddress.city(),
              institution.phoneNumbers(),
              null,
              null,
              institution.emailAddresses());
    };
  }

  protected static String concat(String... strings) {
    return String.join(" ", Arrays.stream(strings).filter(s -> !Strings.isNullOrEmpty(s)).toList());
  }
}

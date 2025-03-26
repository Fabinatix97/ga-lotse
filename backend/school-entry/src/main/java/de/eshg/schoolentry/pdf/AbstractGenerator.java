/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf;

import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.contact.api.InstitutionContactDto;
import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.departmentinfo.DepartmentInfoConfigService;
import de.eshg.lib.contact.ContactClient;
import java.util.UUID;
import org.springframework.util.Assert;

public abstract class AbstractGenerator {

  private final ContactClient contactClient;
  private final DepartmentInfoConfigService departmentInfoConfigService;

  protected AbstractGenerator(
      DepartmentInfoConfigService departmentInfoConfigService, ContactClient contactClient) {
    this.departmentInfoConfigService = departmentInfoConfigService;
    this.contactClient = contactClient;
  }

  protected Address getDepartmentAddress() {
    GetDepartmentInfoResponse departmentInfo = departmentInfoConfigService.getDepartmentInfo();
    return new Address(
        departmentInfo.name(),
        departmentInfo.street() + " " + departmentInfo.houseNumber(),
        departmentInfo.postalCode(),
        departmentInfo.city(),
        departmentInfo.phoneNumber(),
        departmentInfo.homepage(),
        null,
        departmentInfo.email());
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
              domesticAddress.street() + " " + domesticAddress.houseNumber(),
              domesticAddress.postalCode(),
              domesticAddress.city(),
              null,
              null,
              domesticAddress.addressAddition(),
              null);
      case PostboxAddressDto postboxAddress ->
          new Address(
              postboxAddress.postbox(),
              postboxAddress.differentName(),
              postboxAddress.postalCode(),
              postboxAddress.city(),
              null,
              null,
              null,
              null);
    };
  }
}

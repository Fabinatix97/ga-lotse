/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.base.address.AddressDto;
import java.util.List;
import java.util.UUID;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
@JsonSubTypes({
  @JsonSubTypes.Type(
      value = UpdateInstitutionContactRequest.class,
      name = UpdateInstitutionContactRequest.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = UpdatePersonContactRequest.class,
      name = UpdatePersonContactRequest.SCHEMA_NAME)
})
public sealed interface AbstractUpdateContactRequest
    permits UpdateInstitutionContactRequest, UpdatePersonContactRequest {
  UUID mergedFrom();

  String name();

  List<String> phoneNumbers();

  List<String> emailAddresses();

  AddressDto contactAddress();

  AddressDto differentBillingAddress();
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.base.address.AddressDto;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
@JsonSubTypes({
  @JsonSubTypes.Type(
      value = AddInstitutionContactRequest.class,
      name = AddInstitutionContactRequest.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = AddPersonContactRequest.class,
      name = AddPersonContactRequest.SCHEMA_NAME)
})
public sealed interface AbstractAddContactRequest
    permits AddInstitutionContactRequest, AddPersonContactRequest {
  String name();

  @ArraySchema(
      arraySchema =
          @Schema(
              description = "A list of telephone numbers of the Contact.",
              example = "['+4912345678901','+4912345678902','+4912345678903']"))
  List<String> phoneNumbers();

  @ArraySchema(
      arraySchema =
          @Schema(
              description = "A list of email addresses of the Contact.",
              example = "['mail1@address.de','mail2@address.de','mail3@address.de']"))
  List<String> emailAddresses();

  AddressDto contactAddress();

  AddressDto differentBillingAddress();
}

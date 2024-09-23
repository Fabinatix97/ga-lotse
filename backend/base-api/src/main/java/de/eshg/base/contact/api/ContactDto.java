/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.base.HasTypeDiscriminator;
import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import java.util.UUID;

@Schema(name = "Contact")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(value = InstitutionContactDto.class, name = InstitutionContactDto.SCHEMA_NAME),
  @JsonSubTypes.Type(value = PersonContactDto.class, name = PersonContactDto.SCHEMA_NAME)
})
public sealed interface ContactDto extends HasTypeDiscriminator
    permits InstitutionContactDto, PersonContactDto {
  @Schema(description = "Id of the Contact.", example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
  UUID id();

  @Schema(
      description =
          "Id of the Contact into which this Contact has been merged. Contact details are taken from this Id automatically, the Contact history remains with the old Id.",
      example = "be9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
  UUID mergedIntoId();

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

  @Schema(
      implementation = Object.class,
      oneOf = {DomesticAddressDto.class, PostboxAddressDto.class},
      description = "The contact address of the Contact.")
  AddressDto contactAddress();

  @Schema(
      implementation = Object.class,
      oneOf = {DomesticAddressDto.class, PostboxAddressDto.class},
      description = "An optional deviating billing address of the Contact.")
  AddressDto differentBillingAddress();
}

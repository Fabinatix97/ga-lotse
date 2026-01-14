/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.api.commons.HasTypeDiscriminator;
import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "SchoolEntryAddress")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @Type(
      value = SchoolEntryDomesticAddressDto.class,
      name = SchoolEntryDomesticAddressDto.SCHEMA_NAME),
  @Type(value = SchoolEntryPostboxAddressDto.class, name = SchoolEntryPostboxAddressDto.SCHEMA_NAME)
})
public sealed interface SchoolEntryAddressDto extends HasTypeDiscriminator
    permits SchoolEntryDomesticAddressDto, SchoolEntryPostboxAddressDto {
  CountryCode country();

  String city();

  String postalCode();

  String differentName();
}

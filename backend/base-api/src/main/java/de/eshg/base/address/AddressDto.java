/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.address;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.api.commons.HasTypeDiscriminator;
import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Address")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @Type(value = DomesticAddressDto.class, name = DomesticAddressDto.SCHEMA_NAME),
  @Type(value = PostboxAddressDto.class, name = PostboxAddressDto.SCHEMA_NAME)
})
public sealed interface AddressDto extends HasTypeDiscriminator
    permits DomesticAddressDto, PostboxAddressDto {

  CountryCode country();

  String city();

  String postalCode();

  String differentName();
}

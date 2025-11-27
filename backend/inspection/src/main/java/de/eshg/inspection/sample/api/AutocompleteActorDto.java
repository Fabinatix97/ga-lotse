/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.api;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.api.commons.HasTypeDiscriminator;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AutocompleteActor")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(
      value = AutocompleteContactDto.class,
      name = AutocompleteContactDto.SCHEMA_NAME),
  @JsonSubTypes.Type(value = AutocompleteUserDto.class, name = AutocompleteUserDto.SCHEMA_NAME),
})
public sealed interface AutocompleteActorDto extends HasTypeDiscriminator
    permits AutocompleteContactDto, AutocompleteUserDto {
  String name();
}

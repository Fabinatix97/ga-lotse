/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.api.commons.HasTypeDiscriminator;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "PerformingPerson")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(value = ExistingUserDto.class, name = ExistingUserDto.SCHEMA_NAME),
  @JsonSubTypes.Type(value = NonExistingUserDto.class, name = NonExistingUserDto.SCHEMA_NAME)
})
public sealed interface PerformingPersonDto extends HasTypeDiscriminator
    permits ExistingUserDto, NonExistingUserDto {
  @NotNull
  @JsonProperty
  UUID id();
}

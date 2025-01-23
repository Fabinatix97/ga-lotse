/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.base.HasTypeDiscriminator;
import io.swagger.v3.oas.annotations.media.Schema;

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
    permits ExistingUserDto, NonExistingUserDto {}

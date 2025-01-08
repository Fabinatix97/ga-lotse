/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.media.DiscriminatorMapping;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "AbstractContactChange",
    discriminatorMapping = {
      @DiscriminatorMapping(
          value = InstitutionContactChange.SCHEMA_NAME,
          schema = InstitutionContactChange.class),
      @DiscriminatorMapping(
          value = PersonContactChange.SCHEMA_NAME,
          schema = PersonContactChange.class),
      @DiscriminatorMapping(
          value = DomesticContactAddressChange.SCHEMA_NAME,
          schema = DomesticContactAddressChange.class),
      @DiscriminatorMapping(
          value = PostboxContactAddressChange.SCHEMA_NAME,
          schema = PostboxContactAddressChange.class),
    })
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
@JsonSubTypes({
  @Type(value = InstitutionContactChange.class, name = InstitutionContactChange.SCHEMA_NAME),
  @Type(value = PersonContactChange.class, name = PersonContactChange.SCHEMA_NAME),
  @Type(
      value = DomesticContactAddressChange.class,
      name = DomesticContactAddressChange.SCHEMA_NAME),
  @Type(value = PostboxContactAddressChange.class, name = PostboxContactAddressChange.SCHEMA_NAME),
})
public sealed interface AbstractContactChange
    permits ContactChange, InstitutionContactChange, PersonContactChange, ContactAddressChange {}

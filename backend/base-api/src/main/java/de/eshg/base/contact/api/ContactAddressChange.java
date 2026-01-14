/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.base.history.HistoryChange;
import de.eshg.lib.common.CountryCode;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
@JsonSubTypes({
  @Type(
      value = DomesticContactAddressChange.class,
      name = DomesticContactAddressChange.SCHEMA_NAME),
  @Type(value = PostboxContactAddressChange.class, name = PostboxContactAddressChange.SCHEMA_NAME)
})
public sealed interface ContactAddressChange extends AbstractContactChange
    permits DomesticContactAddressChange, PostboxContactAddressChange {

  HistoryChange<CountryCode> country();

  HistoryChange<String> city();

  HistoryChange<String> postalCode();

  HistoryChange<String> differentName();
}

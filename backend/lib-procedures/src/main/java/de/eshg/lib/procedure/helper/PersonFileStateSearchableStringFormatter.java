/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.helper;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.function.Function;

public class PersonFileStateSearchableStringFormatter
    extends AbstractSearchableStringFormatter<AddPersonFileStateResponse> {

  private final PostboxAddressDtoSearchableStringFormatter
      postboxAddressDtoSearchableStringFormatter = new PostboxAddressDtoSearchableStringFormatter();
  private final DomesticAddressDtoSearchableStringFormatter
      domesticAddressDtoSearchableStringFormatter =
          new DomesticAddressDtoSearchableStringFormatter();

  @Override
  protected Class<AddPersonFileStateResponse> getClazz() {
    return AddPersonFileStateResponse.class;
  }

  @Override
  protected List<TypedPropertyFormatter<AddPersonFileStateResponse, ?>> getPropertyFormatters() {
    return List.of(
        new TypedPropertyFormatter<>(AddPersonFileStateResponse::title, Function.identity()),
        new TypedPropertyFormatter<>(AddPersonFileStateResponse::firstName, Function.identity()),
        new TypedPropertyFormatter<>(AddPersonFileStateResponse::lastName, Function.identity()),
        new TypedPropertyFormatter<>(
            AddPersonFileStateResponse::contactAddress, this::formatAddress),
        new TypedPropertyFormatter<>(
            AddPersonFileStateResponse::dateOfBirth,
            date -> date.format(DateTimeFormatter.ISO_LOCAL_DATE)),
        new TypedPropertyFormatter<>(
            AddPersonFileStateResponse::differentBillingAddress, this::formatAddress),
        new TypedPropertyFormatter<>(
            AddPersonFileStateResponse::emailAddresses, this::formatListOfStringsByConcatenation),
        new TypedPropertyFormatter<>(AddPersonFileStateResponse::nameAtBirth, Function.identity()),
        new TypedPropertyFormatter<>(AddPersonFileStateResponse::placeOfBirth, Function.identity()),
        new TypedPropertyFormatter<>(
            AddPersonFileStateResponse::phoneNumbers, this::formatListOfStringsByConcatenation));
  }

  private String formatAddress(AddressDto addressDto) {
    return switch (addressDto) {
      case DomesticAddressDto domesticAddressDto ->
          domesticAddressDtoSearchableStringFormatter.formatAsSearchable(domesticAddressDto);
      case PostboxAddressDto postboxAddressDto ->
          postboxAddressDtoSearchableStringFormatter.formatAsSearchable(postboxAddressDto);
    };
  }
}

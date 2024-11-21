/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.helper;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.function.Function;

public class PersonFileStateSearchableStringFormatter
    extends AbstractSearchableStringFormatter<GetPersonFileStateResponse> {

  private final PostboxAddressDtoSearchableStringFormatter
      postboxAddressDtoSearchableStringFormatter = new PostboxAddressDtoSearchableStringFormatter();
  private final DomesticAddressDtoSearchableStringFormatter
      domesticAddressDtoSearchableStringFormatter =
          new DomesticAddressDtoSearchableStringFormatter();

  @Override
  protected Class<GetPersonFileStateResponse> getClazz() {
    return GetPersonFileStateResponse.class;
  }

  @Override
  protected List<TypedPropertyFormatter<GetPersonFileStateResponse, ?>> getPropertyFormatters() {
    return List.of(
        new TypedPropertyFormatter<>(GetPersonFileStateResponse::title, Function.identity()),
        new TypedPropertyFormatter<>(GetPersonFileStateResponse::firstName, Function.identity()),
        new TypedPropertyFormatter<>(GetPersonFileStateResponse::lastName, Function.identity()),
        new TypedPropertyFormatter<>(
            GetPersonFileStateResponse::contactAddress, this::formatAddress),
        new TypedPropertyFormatter<>(
            GetPersonFileStateResponse::dateOfBirth,
            date -> date.format(DateTimeFormatter.ISO_LOCAL_DATE)),
        new TypedPropertyFormatter<>(
            GetPersonFileStateResponse::differentBillingAddress, this::formatAddress),
        new TypedPropertyFormatter<>(
            GetPersonFileStateResponse::emailAddresses, this::formatListOfStringsByConcatenation),
        new TypedPropertyFormatter<>(GetPersonFileStateResponse::nameAtBirth, Function.identity()),
        new TypedPropertyFormatter<>(GetPersonFileStateResponse::placeOfBirth, Function.identity()),
        new TypedPropertyFormatter<>(
            GetPersonFileStateResponse::phoneNumbers, this::formatListOfStringsByConcatenation));
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

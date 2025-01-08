/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.helper;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.FacilityContactPersonDto;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

public class FacilityFileStateSearchableStringFormatter
    extends AbstractSearchableStringFormatter<AddFacilityFileStateResponse> {

  private final FacilityContactPersonSearchableStringFormatter
      facilityContactPersonSearchableStringFormatter =
          new FacilityContactPersonSearchableStringFormatter();
  private final PostboxAddressDtoSearchableStringFormatter
      postboxAddressDtoSearchableStringFormatter = new PostboxAddressDtoSearchableStringFormatter();
  private final DomesticAddressDtoSearchableStringFormatter
      domesticAddressDtoSearchableStringFormatter =
          new DomesticAddressDtoSearchableStringFormatter();

  @Override
  protected Class<AddFacilityFileStateResponse> getClazz() {
    return AddFacilityFileStateResponse.class;
  }

  @Override
  protected List<TypedPropertyFormatter<AddFacilityFileStateResponse, ?>> getPropertyFormatters() {
    return List.of(
        new TypedPropertyFormatter<>(AddFacilityFileStateResponse::name, Function.identity()),
        new TypedPropertyFormatter<>(
            AddFacilityFileStateResponse::emailAddresses, this::formatListOfStringsByConcatenation),
        new TypedPropertyFormatter<>(
            AddFacilityFileStateResponse::phoneNumbers, this::formatListOfStringsByConcatenation),
        new TypedPropertyFormatter<>(
            AddFacilityFileStateResponse::contactPersons, this::formatPersons),
        new TypedPropertyFormatter<>(
            AddFacilityFileStateResponse::contactAddress, this::formatAddress),
        new TypedPropertyFormatter<>(
            AddFacilityFileStateResponse::differentBillingAddress, this::formatAddress));
  }

  private String formatPersons(List<FacilityContactPersonDto> facilityContactPersonDtos) {
    return facilityContactPersonDtos.stream()
        .map(facilityContactPersonSearchableStringFormatter::formatAsSearchable)
        .collect(Collectors.joining(" "));
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

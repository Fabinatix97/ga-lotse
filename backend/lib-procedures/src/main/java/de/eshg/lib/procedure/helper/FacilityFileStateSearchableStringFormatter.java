/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.helper;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.centralfile.api.facility.FacilityContactPersonDto;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

public class FacilityFileStateSearchableStringFormatter
    extends AbstractSearchableStringFormatter<GetFacilityFileStateResponse> {

  private final FacilityContactPersonSearchableStringFormatter
      facilityContactPersonSearchableStringFormatter =
          new FacilityContactPersonSearchableStringFormatter();
  private final PostboxAddressDtoSearchableStringFormatter
      postboxAddressDtoSearchableStringFormatter = new PostboxAddressDtoSearchableStringFormatter();
  private final DomesticAddressDtoSearchableStringFormatter
      domesticAddressDtoSearchableStringFormatter =
          new DomesticAddressDtoSearchableStringFormatter();

  @Override
  protected Class<GetFacilityFileStateResponse> getClazz() {
    return GetFacilityFileStateResponse.class;
  }

  @Override
  protected List<TypedPropertyFormatter<GetFacilityFileStateResponse, ?>> getPropertyFormatters() {
    return List.of(
        new TypedPropertyFormatter<>(GetFacilityFileStateResponse::name, Function.identity()),
        new TypedPropertyFormatter<>(
            GetFacilityFileStateResponse::emailAddresses, this::formatListOfStringsByConcatenation),
        new TypedPropertyFormatter<>(
            GetFacilityFileStateResponse::phoneNumbers, this::formatListOfStringsByConcatenation),
        new TypedPropertyFormatter<>(
            GetFacilityFileStateResponse::contactPersons, this::formatPersons),
        new TypedPropertyFormatter<>(
            GetFacilityFileStateResponse::contactAddress, this::formatAddress),
        new TypedPropertyFormatter<>(
            GetFacilityFileStateResponse::differentBillingAddress, this::formatAddress));
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

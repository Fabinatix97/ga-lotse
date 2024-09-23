/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.helper;

import de.eshg.base.address.DomesticAddressDto;
import java.util.List;
import java.util.function.Function;

class DomesticAddressDtoSearchableStringFormatter
    extends AbstractSearchableStringFormatter<DomesticAddressDto> {

  @Override
  protected Class<DomesticAddressDto> getClazz() {
    return DomesticAddressDto.class;
  }

  @Override
  protected List<TypedPropertyFormatter<DomesticAddressDto, ?>> getPropertyFormatters() {
    return List.of(
        new TypedPropertyFormatter<>(DomesticAddressDto::differentName, Function.identity()),
        new TypedPropertyFormatter<>(DomesticAddressDto::addressAddition, Function.identity()),
        new TypedPropertyFormatter<>(DomesticAddressDto::street, Function.identity()),
        new TypedPropertyFormatter<>(DomesticAddressDto::city, Function.identity()),
        new TypedPropertyFormatter<>(DomesticAddressDto::houseNumber, Function.identity()),
        new TypedPropertyFormatter<>(DomesticAddressDto::postalCode, Function.identity()));
  }
}

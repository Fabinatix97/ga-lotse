/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.helper;

import de.eshg.base.address.PostboxAddressDto;
import java.util.List;
import java.util.function.Function;

class PostboxAddressDtoSearchableStringFormatter
    extends AbstractSearchableStringFormatter<PostboxAddressDto> {

  @Override
  protected Class<PostboxAddressDto> getClazz() {
    return PostboxAddressDto.class;
  }

  @Override
  protected List<TypedPropertyFormatter<PostboxAddressDto, ?>> getPropertyFormatters() {
    return List.of(
        new TypedPropertyFormatter<>(PostboxAddressDto::differentName, Function.identity()),
        new TypedPropertyFormatter<>(PostboxAddressDto::postbox, Function.identity()),
        new TypedPropertyFormatter<>(PostboxAddressDto::postalCode, Function.identity()),
        new TypedPropertyFormatter<>(PostboxAddressDto::city, Function.identity()));
  }
}

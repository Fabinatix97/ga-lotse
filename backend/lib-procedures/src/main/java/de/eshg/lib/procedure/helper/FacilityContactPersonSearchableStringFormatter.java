/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.helper;

import de.eshg.base.centralfile.api.facility.FacilityContactPersonDto;
import java.util.List;
import java.util.function.Function;

public class FacilityContactPersonSearchableStringFormatter
    extends AbstractSearchableStringFormatter<FacilityContactPersonDto> {

  @Override
  protected Class<FacilityContactPersonDto> getClazz() {
    return FacilityContactPersonDto.class;
  }

  @Override
  protected List<TypedPropertyFormatter<FacilityContactPersonDto, ?>> getPropertyFormatters() {
    return List.of(
        new TypedPropertyFormatter<>(FacilityContactPersonDto::firstName, Function.identity()),
        new TypedPropertyFormatter<>(FacilityContactPersonDto::lastName, Function.identity()),
        new TypedPropertyFormatter<>(FacilityContactPersonDto::emailAddress, Function.identity()),
        new TypedPropertyFormatter<>(FacilityContactPersonDto::phoneNumber, Function.identity()),
        new TypedPropertyFormatter<>(FacilityContactPersonDto::role, Function.identity()));
  }
}

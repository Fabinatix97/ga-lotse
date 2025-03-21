/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.mapper;

import de.eshg.base.contact.api.ContactDto;
import de.eshg.dental.api.InstitutionDto;

public class InstitutionMapper {

  private InstitutionMapper() {}

  public static InstitutionDto mapContactToInstitutionDto(ContactDto contact) {
    return new InstitutionDto(contact.id(), contact.name());
  }
}

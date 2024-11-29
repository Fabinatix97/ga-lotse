/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.mapper;

import de.eshg.base.contact.api.ContactDto;
import de.eshg.dental.api.InstitutionDto;
import de.eshg.dental.api.ProphylaxisSessionDto;
import de.eshg.dental.business.model.ProphylaxisSessionWithAugmentedData;
import de.eshg.dental.domain.model.ProphylaxisSession;

public final class ProphylaxisSessionMapper {

  private ProphylaxisSessionMapper() {}

  public static ProphylaxisSessionDto mapProphylaxisSessionToDto(
      ProphylaxisSessionWithAugmentedData sessionWithAugmentedData) {
    ProphylaxisSession session = sessionWithAugmentedData.prophylaxisSession();
    ContactDto contact = sessionWithAugmentedData.contact();
    return new ProphylaxisSessionDto(
        session.getExternalId(),
        session.getDateAndTime(),
        new InstitutionDto(contact.id(), contact.name()));
  }
}

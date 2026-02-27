/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.mapper;

import de.eshg.infectionbriefing.api.CustodianConsentDto;
import de.eshg.infectionbriefing.api.CustodianConsentInfoDto;
import de.eshg.infectionbriefing.domain.model.CustodianConsent;

public class CustodianConsentMapper {
  private CustodianConsentMapper() {}

  public static CustodianConsentInfoDto toInterfaceType(CustodianConsent custodianConsent) {
    return switch (custodianConsent) {
      case null -> null;
      case IN_PERSON -> CustodianConsentInfoDto.IN_PERSON;
      case WRITTEN -> CustodianConsentInfoDto.WRITTEN;
    };
  }

  public static CustodianConsent toDomainType(CustodianConsentDto custodianConsent) {
    return switch (custodianConsent) {
      case null -> null;
      case IN_PERSON -> CustodianConsent.IN_PERSON;
      case WRITTEN -> CustodianConsent.WRITTEN;
    };
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.mapper;

import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.dental.api.ChildResult;
import de.eshg.dental.api.InstitutionDto;
import de.eshg.dental.api.ProphylaxisSessionDetailsDto;
import de.eshg.dental.api.ProphylaxisSessionDto;
import de.eshg.dental.api.ProphylaxisTypeDto;
import de.eshg.dental.business.model.ProphylaxisSessionWithAugmentedData;
import de.eshg.dental.business.model.ProphylaxisSessionWithAugmentedInstitution;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.ProphylaxisSession;
import de.eshg.dental.domain.model.ProphylaxisType;
import java.util.List;
import java.util.Map;

public final class ProphylaxisSessionMapper {

  private ProphylaxisSessionMapper() {}

  public static ProphylaxisSessionDto mapProphylaxisSessionToDto(
      ProphylaxisSessionWithAugmentedInstitution sessionWithAugmentedData) {
    ProphylaxisSession session = sessionWithAugmentedData.prophylaxisSession();
    ContactDto institution = sessionWithAugmentedData.institution();
    return new ProphylaxisSessionDto(
        session.getExternalId(),
        session.getDateAndTime(),
        new InstitutionDto(
            institution.id(),
            institution.name(),
            InstitutionHexColorMapper.mapInstitutionContactToHexColor(institution)),
        session.getGroupName(),
        mapToDto(session.getType()));
  }

  public static ProphylaxisTypeDto mapToDto(ProphylaxisType type) {
    return switch (type) {
      case null -> null;
      case P1 -> ProphylaxisTypeDto.P1;
      case P2 -> ProphylaxisTypeDto.P2;
      case P3 -> ProphylaxisTypeDto.P3;
      case P4 -> ProphylaxisTypeDto.P4;
      case P5 -> ProphylaxisTypeDto.P5;
      case P6 -> ProphylaxisTypeDto.P6;
      case P7 -> ProphylaxisTypeDto.P7;
    };
  }

  public static ProphylaxisType mapToDomain(ProphylaxisTypeDto dto) {
    return switch (dto) {
      case null -> null;
      case P1 -> ProphylaxisType.P1;
      case P2 -> ProphylaxisType.P2;
      case P3 -> ProphylaxisType.P3;
      case P4 -> ProphylaxisType.P4;
      case P5 -> ProphylaxisType.P5;
      case P6 -> ProphylaxisType.P6;
      case P7 -> ProphylaxisType.P7;
    };
  }

  public static ProphylaxisSessionDetailsDto mapProphylaxisSessionToDetailsDto(
      ProphylaxisSessionWithAugmentedData prophylaxisSession) {
    ProphylaxisSession session = prophylaxisSession.prophylaxisSession();
    ContactDto institution = prophylaxisSession.institution();
    return new ProphylaxisSessionDetailsDto(
        session.getVersion(),
        session.getExternalId(),
        session.getDateAndTime(),
        new InstitutionDto(
            institution.id(),
            institution.name(),
            InstitutionHexColorMapper.mapInstitutionContactToHexColor(institution)),
        session.getGroupName(),
        mapToDto(session.getType()),
        mapToChildResults(prophylaxisSession.participants()));
  }

  private static List<ChildResult> mapToChildResults(
      Map<Child, GetPersonFileStateResponse> fileStateResponses) {
    if (fileStateResponses == null) {
      return List.of();
    }
    return fileStateResponses.entrySet().stream()
        .map(ProphylaxisSessionMapper::mapToChildResult)
        .toList();
  }

  private static ChildResult mapToChildResult(
      Map.Entry<Child, GetPersonFileStateResponse> fileStateResponse) {
    return new ChildResult(
        fileStateResponse.getKey().getExternalId(),
        fileStateResponse.getValue().firstName(),
        fileStateResponse.getValue().lastName(),
        fileStateResponse.getValue().dateOfBirth(),
        fileStateResponse.getKey().getGroupName());
  }
}

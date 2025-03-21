/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.mapper;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.user.api.UserDto;
import de.eshg.dental.api.ExistingUserDto;
import de.eshg.dental.api.FluoridationVarnishDto;
import de.eshg.dental.api.NonExistingUserDto;
import de.eshg.dental.api.PerformingPersonDto;
import de.eshg.dental.api.ProphylaxisSessionChildExaminationDto;
import de.eshg.dental.api.ProphylaxisSessionDetailsDto;
import de.eshg.dental.api.ProphylaxisSessionDto;
import de.eshg.dental.api.ProphylaxisTypeDto;
import de.eshg.dental.business.model.ProphylaxisSessionWithAugmentedData;
import de.eshg.dental.business.model.ProphylaxisSessionWithAugmentedInstitution;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.model.FluoridationConsent;
import de.eshg.dental.domain.model.FluoridationVarnish;
import de.eshg.dental.domain.model.ProphylaxisSession;
import de.eshg.dental.domain.model.ProphylaxisType;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public final class ProphylaxisSessionMapper {

  private ProphylaxisSessionMapper() {}

  public static ProphylaxisSessionDto mapProphylaxisSessionToDto(
      ProphylaxisSessionWithAugmentedInstitution sessionWithAugmentedData) {
    ProphylaxisSession session = sessionWithAugmentedData.prophylaxisSession();
    ContactDto institution = sessionWithAugmentedData.institution();
    return new ProphylaxisSessionDto(
        session.getExternalId(),
        session.getDateAndTime(),
        InstitutionMapper.mapContactToInstitutionDto(institution),
        session.getGroupName(),
        mapToDto(session.getType()),
        session.isScreening(),
        mapToDto(session.getFluoridationVarnish()));
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
    Map<UUID, UserDto> userMap = prophylaxisSession.users();
    return new ProphylaxisSessionDetailsDto(
        session.getVersion(),
        session.getExternalId(),
        session.getDateAndTime(),
        InstitutionMapper.mapContactToInstitutionDto(institution),
        session.getGroupName(),
        mapToDto(session.getType()),
        session.isScreening(),
        DentitionTypeMapper.mapToDto(session.getDentitionType()),
        mapToDto(session.getFluoridationVarnish()),
        getParticipants(prophylaxisSession),
        mapPersons(session.getDentistIds(), userMap),
        mapPersons(session.getZfaIds(), userMap));
  }

  private static List<ProphylaxisSessionChildExaminationDto> getParticipants(
      ProphylaxisSessionWithAugmentedData prophylaxisSessionAugmented) {
    Map<Examination, GetPersonFileStateResponse> fileStateResponses =
        prophylaxisSessionAugmented.participants();
    if (fileStateResponses == null) {
      return List.of();
    }
    return fileStateResponses.entrySet().stream()
        .map(
            entry -> {
              Examination examination = entry.getKey();
              GetPersonFileStateResponse fileStateResponse = entry.getValue();
              List<Examination> previousExaminations =
                  prophylaxisSessionAugmented
                      .previousExaminationsByChildFileStateId()
                      .getOrDefault(examination.getChild().getChildIdFromCentralFile(), List.of());
              List<FluoridationConsent> allFluoridationConsents =
                  prophylaxisSessionAugmented
                      .allFluoridationConsentsByChildFileStateId()
                      .getOrDefault(examination.getChild().getChildIdFromCentralFile(), List.of());

              return mapToChildExamination(
                  examination, fileStateResponse, previousExaminations, allFluoridationConsents);
            })
        .toList();
  }

  private static ProphylaxisSessionChildExaminationDto mapToChildExamination(
      Examination examination,
      GetPersonFileStateResponse fileStateResponse,
      List<Examination> previousExaminations,
      List<FluoridationConsent> allFluoridationConsents) {
    return new ProphylaxisSessionChildExaminationDto(
        examination.getVersion(),
        examination.getExternalId(),
        examination.getChild().getExternalId(),
        fileStateResponse.firstName(),
        fileStateResponse.lastName(),
        fileStateResponse.dateOfBirth(),
        examination.getChild().getGroupName().trim(),
        fileStateResponse.gender(),
        examination.getNote(),
        DentitionTypeMapper.mapToDto(examination.getProphylaxisSession().getDentitionType()),
        ChildMapper.mapFluoridationToDto(
            allFluoridationConsents.stream()
                .sorted(
                    Comparator.comparing(FluoridationConsent::getDateOfConsent)
                        .thenComparing(FluoridationConsent::getModifiedAt)
                        .reversed())
                .toList()),
        ExaminationMapper.mapToDto(examination.getResult()),
        previousExaminations.stream()
            .filter(e -> e.getResult() != null)
            .sorted(Comparator.comparing(Examination::getDateAndTime).reversed())
            .collect(
                StreamUtil.toLinkedHashMap(
                    Examination::getDateAndTime, e -> ExaminationMapper.mapToDto(e.getResult()))));
  }

  private static List<? extends PerformingPersonDto> mapPersons(
      List<UUID> dentistOrZfaIds, Map<UUID, UserDto> userMap) {
    return dentistOrZfaIds.stream()
        .map(
            userId ->
                Optional.ofNullable(userMap.get(userId))
                    .<PerformingPersonDto>map(
                        user -> new ExistingUserDto(userId, user.firstName(), user.lastName()))
                    .orElse(new NonExistingUserDto(userId)))
        .toList();
  }

  public static FluoridationVarnishDto mapToDto(FluoridationVarnish fluoridationVarnish) {
    return switch (fluoridationVarnish) {
      case null -> null;
      case A -> FluoridationVarnishDto.A;
      case B -> FluoridationVarnishDto.B;
      case C -> FluoridationVarnishDto.C;
      case D -> FluoridationVarnishDto.D;
    };
  }

  public static FluoridationVarnish mapToDomain(FluoridationVarnishDto dto) {
    return switch (dto) {
      case null -> null;
      case A -> FluoridationVarnish.A;
      case B -> FluoridationVarnish.B;
      case C -> FluoridationVarnish.C;
      case D -> FluoridationVarnish.D;
    };
  }
}

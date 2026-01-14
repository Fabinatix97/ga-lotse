/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.mapper;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.user.api.UserDto;
import de.eshg.dental.api.*;
import de.eshg.dental.business.model.ChildWithPersonAndContactData;
import de.eshg.dental.business.model.ProphylaxisSessionExaminationUpdateResult;
import de.eshg.dental.business.model.ProphylaxisSessionWithAugmentedData;
import de.eshg.dental.business.model.ProphylaxisSessionWithAugmentedInstitution;
import de.eshg.dental.domain.model.*;
import java.util.*;

public final class ProphylaxisSessionMapper {

  private ProphylaxisSessionMapper() {}

  public static ProphylaxisSessionDto mapProphylaxisSessionToDto(
      ProphylaxisSessionWithAugmentedInstitution sessionWithAugmentedData) {
    ProphylaxisSession session = sessionWithAugmentedData.prophylaxisSession();
    ContactDto institution = sessionWithAugmentedData.institution();
    return new ProphylaxisSessionDto(
        session.getExternalId(),
        session.getVersion(),
        session.getDateAndTime(),
        InstitutionMapper.mapContactToInstitutionDto(institution),
        session.getGroupName(),
        mapToDto(session.getType()),
        session.isScreening(),
        mapToDto(session.getFluoridationVarnish()),
        mapToDto(session.getProphylaxisStatus()),
        hasNoExaminationResults(session));
  }

  private static boolean hasNoExaminationResults(ProphylaxisSession session) {
    return session.getExaminations().stream()
        .map(Examination::getResult)
        .filter(Objects::nonNull)
        .toList()
        .isEmpty();
  }

  private static ProphylaxisStatusDto mapToDto(ProphylaxisStatus status) {
    return switch (status) {
      case null -> null;
      case OPEN -> ProphylaxisStatusDto.OPEN;
      case CLOSED -> ProphylaxisStatusDto.CLOSED;
    };
  }

  public static ProphylaxisStatus mapToDomain(ProphylaxisStatusDto dto) {
    return switch (dto) {
      case null -> null;
      case OPEN -> ProphylaxisStatus.OPEN;
      case CLOSED -> ProphylaxisStatus.CLOSED;
    };
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
        mapToDto(session.getProphylaxisStatus()),
        getParticipants(prophylaxisSession),
        mapPersons(session.getDentistIds(), userMap),
        mapPersons(session.getZfaIds(), userMap));
  }

  public static ProphylaxisSessionExaminationUpdateResultDto
      mapProphylaxisSessionExaminationUpdateResultToDto(
          ProphylaxisSessionExaminationUpdateResult result) {
    return new ProphylaxisSessionExaminationUpdateResultDto(
        result.failedPersonUpdates(),
        result.failedExaminationUpdates(),
        mapProphylaxisSessionToDetailsDto(result.prophylaxisSession()));
  }

  private static List<ProphylaxisSessionChildExaminationDto> getParticipants(
      ProphylaxisSessionWithAugmentedData prophylaxisSessionAugmented) {
    Map<Examination, ChildWithPersonAndContactData> childrenData =
        prophylaxisSessionAugmented.participants();
    if (childrenData == null) {
      return List.of();
    }
    return childrenData.entrySet().stream()
        .map(
            entry -> {
              Examination examination = entry.getKey();
              ChildWithPersonAndContactData childData = entry.getValue();
              List<Examination> previousExaminations =
                  prophylaxisSessionAugmented
                      .previousScreeningExaminationsByChildFileStateId()
                      .getOrDefault(examination.getChild().getChildIdFromCentralFile(), List.of());
              List<FluoridationConsent> allFluoridationConsents =
                  prophylaxisSessionAugmented
                      .allFluoridationConsentsByChildFileStateId()
                      .getOrDefault(examination.getChild().getChildIdFromCentralFile(), List.of());

              return mapToChildExamination(
                  examination, childData, previousExaminations, allFluoridationConsents);
            })
        .toList();
  }

  private static ProphylaxisSessionChildExaminationDto mapToChildExamination(
      Examination examination,
      ChildWithPersonAndContactData childData,
      List<Examination> previousExaminations,
      List<FluoridationConsent> allFluoridationConsents) {

    GetPersonFileStateResponse personData = childData.person();
    return new ProphylaxisSessionChildExaminationDto(
        examination.getVersion(),
        examination.getExternalId(),
        childData.child().getExternalId(),
        childData.child().getVersion(),
        personData.firstName(),
        personData.lastName(),
        personData.dateOfBirth(),
        personData.outdated(),
        InstitutionMapper.mapContactToInstitutionDto(childData.contact()),
        childData.child().getGroupName(),
        personData.gender(),
        ProcedureLabelMapper.toDto(childData.child().getProcedureLabels()),
        examination.getChild().getNote(),
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
            .filter(e -> e.getResult() instanceof ScreeningExaminationResult)
            .sorted(Comparator.comparing(Examination::getDateAndTime).reversed())
            .collect(
                StreamUtil.toLinkedHashMap(
                    Examination::getDateAndTime,
                    e ->
                        (ScreeningExaminationResultDto)
                            ExaminationMapper.mapToDto(e.getResult()))));
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

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import static de.eshg.lib.procedure.util.ProcedureValidator.hasNonNullValue;

import de.cronn.commons.lang.StreamUtil;
import de.cronn.reflection.util.PropertyGetter;
import de.cronn.reflection.util.PropertyUtils;
import de.eshg.base.contact.api.InstitutionContactCategoryDto;
import de.eshg.base.contact.api.InstitutionContactDto;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.UserDto;
import de.eshg.dental.api.ChildFilterParameters;
import de.eshg.dental.api.DentitionTypeDto;
import de.eshg.dental.api.FluoridationConsentDto;
import de.eshg.dental.api.GroupPromotionDto;
import de.eshg.dental.api.MainResultDto;
import de.eshg.dental.api.ToothDiagnosisDto;
import de.eshg.dental.api.ToothDto;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.model.ExaminationResult;
import de.eshg.dental.domain.model.FluoridationConsent;
import de.eshg.dental.domain.model.FluoridationExaminationResult;
import de.eshg.dental.domain.model.ProphylaxisSession;
import de.eshg.dental.domain.model.ScreeningExaminationResult;
import de.eshg.dental.domain.model.ToothDiagnosis;
import de.eshg.dental.domain.repository.ChildRepository;
import de.eshg.domain.model.SequencedBaseEntityWithExternalId;
import de.eshg.lib.contact.ContactClient;
import de.eshg.lib.keycloak.TechnicalGroup;
import de.eshg.lib.procedure.api.ProcedureSearchParameters;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.rest.service.error.BadRequestException;
import java.beans.PropertyDescriptor;
import java.time.Clock;
import java.time.Year;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

@Component
public class Validator {

  private static final String PROPHYLAXIS_SESSION_INCOMPLETE_MESSAGE =
      "ProphylaxisSession cannot be closed, because at least one existing examination has not yet been closed.";

  private final Clock clock;
  private final ContactClient contactClient;
  private final ChildRepository childRepository;
  private final UserApi userApi;

  private static final List<PropertyGetter<ProphylaxisSession>> UPDATABLE_WITHOUT_RESULT_ONLY =
      List.of(
          ProphylaxisSession::getInstitutionId,
          ProphylaxisSession::getGroupName,
          ProphylaxisSession::isScreening,
          ProphylaxisSession::getFluoridationVarnish);

  public Validator(
      Clock clock, ContactClient contactClient, ChildRepository childRepository, UserApi userApi) {
    this.clock = clock;
    this.contactClient = contactClient;
    this.childRepository = childRepository;
    this.userApi = userApi;
  }

  public void validateSchoolYear(int schoolYear) {
    Year requestedYear = Year.of(schoolYear);
    Year currentYear = Year.now(clock);
    if (!requestedYear.equals(currentYear) && !requestedYear.equals(currentYear.minusYears(1))) {
      throw new BadRequestException("Illegal school year: " + schoolYear);
    }
  }

  public void validateInstitution(UUID institutionId) {
    contactClient.validateContactIsInstitutionWithCategory(
        institutionId,
        EnumSet.of(InstitutionContactCategoryDto.SCHOOL, InstitutionContactCategoryDto.DAYCARE));
  }

  public void validateInstitutionAndGroupName(UUID institutionId, String groupName) {
    InstitutionContactDto institutionContactDto =
        contactClient.validateContactIsInstitutionWithCategory(
            institutionId,
            EnumSet.of(
                InstitutionContactCategoryDto.SCHOOL, InstitutionContactCategoryDto.DAYCARE));
    InstitutionContactCategoryDto contactCategory = institutionContactDto.category();
    if (contactCategory == InstitutionContactCategoryDto.SCHOOL
        && (groupName == null || groupName.isBlank())) {
      throw new BadRequestException(
          ("Contact with id %s does not have a valid group name."
                  + " Group name is only optional for category daycare.")
              .formatted(institutionId));
    } else if (contactCategory == InstitutionContactCategoryDto.DAYCARE
        && (groupName != null && groupName.isBlank())) {
      throw new BadRequestException("Group name must not be blank.");
    }
  }

  public void validateGroupAtInstitutionExists(UUID institutionId, String groupName) {
    if (!childRepository.existsByInstitutionIdAndGroupNameAndProcedureStatus(
        institutionId, groupName, ProcedureStatus.OPEN)) {
      throw new BadRequestException("Group does not exist: " + groupName);
    }
  }

  static void validateOnlyOneOfSearchAndFilterParametersAreSet(
      ChildFilterParameters filterParameters, ProcedureSearchParameters searchParameters) {
    if (hasNonNullValue(filterParameters) && hasNonNullValue(searchParameters)) {
      throw new BadRequestException(
          "Filter parameters and search parameters can not be used in the same request.");
    }
  }

  void validateTechnicalGroups(List<UUID> dentistIds, List<UUID> zfaIds) {
    if (dentistIds != null && !dentistIds.isEmpty()) {
      validateTechnicalGroup(dentistIds, TechnicalGroup.DENTIST);
    }
    if (zfaIds != null && !zfaIds.isEmpty()) {
      validateTechnicalGroup(zfaIds, TechnicalGroup.ZFA);
    }
  }

  private void validateTechnicalGroup(List<UUID> userIds, TechnicalGroup group) {
    Set<UUID> groupUserIds =
        userApi.getUsersByGroup(group.getKeycloakName()).users().stream()
            .map(UserDto::userId)
            .collect(StreamUtil.toLinkedHashSet());
    if (!groupUserIds.containsAll(userIds)) {
      throw new BadRequestException(
          String.format(
              "Not all userIds belong to the correct technical group (%s).",
              group.getKeycloakName()));
    }
  }

  public void validateFluoridationConsent(FluoridationConsentDto fluoridationConsent) {
    if (fluoridationConsent != null
        && fluoridationConsent.consented()
        && Boolean.TRUE.equals(fluoridationConsent.hasAllergy())) {
      throw new BadRequestException("Child cannot have an allergy and fluoridation consent.");
    }
  }

  static void validateToothDiagnoses(List<ToothDiagnosisDto> toothDiagnoses) {
    List<ToothDto> teeth = toothDiagnoses.stream().map(ToothDiagnosisDto::tooth).toList();
    validateUniqueTeeth(teeth);
    validateMilkOrPermanentTooth(teeth);
    validateDiagnoses(toothDiagnoses);
    validateMainResultU(toothDiagnoses);
  }

  private static void validateMainResultU(List<ToothDiagnosisDto> toothDiagnoses) {
    if (toothDiagnoses.stream()
        .anyMatch(
            toothDiagnosis ->
                toothDiagnosis.mainResult() == MainResultDto.U
                    && ToothDto.isMolar(toothDiagnosis.tooth()))) {
      throw new BadRequestException(
          "Invalid diagnosis. The main result U cannot be set to a molar tooth.");
    }
  }

  private static void validateDiagnoses(List<ToothDiagnosisDto> toothDiagnoses) {
    List<ToothDto> invalidDiagnoses =
        toothDiagnoses.stream()
            .filter(
                toothDiagnosis ->
                    toothDiagnosis.mainResult() == null
                        && (toothDiagnosis.secondaryResult() != null))
            .map(ToothDiagnosisDto::tooth)
            .toList();

    if (!invalidDiagnoses.isEmpty()) {
      throw new BadRequestException(
          "Invalid diagnoses for %s: Secondary result cannot be set without main result"
              .formatted(invalidDiagnoses));
    }
  }

  private static void validateMilkOrPermanentTooth(List<ToothDto> teeth) {
    List<ToothDto> milkTeeth = teeth.stream().filter(ToothDto::isMilkTooth).toList();

    for (ToothDto milkTooth : milkTeeth) {
      ToothDto matchingPermanentTooth = ToothDto.matchingPermanentToothForMilkTooth(milkTooth);
      if (teeth.contains(matchingPermanentTooth)) {
        throw new BadRequestException(
            "Milk tooth %s and matching permanent tooth %s cannot be set together."
                .formatted(milkTooth, matchingPermanentTooth));
      }
    }
  }

  private static void validateUniqueTeeth(List<ToothDto> teeth) {
    List<ToothDto> uniqueTeeth = teeth.stream().distinct().toList();
    if (teeth.size() != uniqueTeeth.size()) {
      throw new BadRequestException("There are teeth twice in the list.");
    }
  }

  public static void validateUpdatableFields(
      ProphylaxisSession current, ProphylaxisSession update) {
    boolean hasExaminationResult =
        current.getExaminations().stream().anyMatch(Examination::hasResult);
    if (hasExaminationResult) {
      UPDATABLE_WITHOUT_RESULT_ONLY.forEach(
          valueGetter -> validateNotChanged(current, update, valueGetter));
    }
  }

  private static void validateNotChanged(
      ProphylaxisSession current,
      ProphylaxisSession update,
      PropertyGetter<ProphylaxisSession> valueGetter) {
    if (!Objects.equals(valueGetter.get(current), valueGetter.get(update))) {
      PropertyDescriptor property = PropertyUtils.getPropertyDescriptor(current, valueGetter);
      throw new BadRequestException(
          String.format(
              "The '%s' property cannot be modified once examination results have been entered.",
              property.getDisplayName()));
    }
  }

  public static void validateAllExaminationsAreClosed(ProphylaxisSession prophylaxisSession) {
    List<Examination> examinations = prophylaxisSession.getExaminations();

    for (Examination examination : examinations) {
      if (!examination.hasResult()) {
        throw new BadRequestException(PROPHYLAXIS_SESSION_INCOMPLETE_MESSAGE);
      }
      ExaminationResult result = examination.getResult();
      FluoridationConsent currentFluoridationConsent =
          examination.getChild().getCurrentFluoridationConsent();

      if (result instanceof FluoridationExaminationResult fluoridationExaminationResult) {
        validateFluoridationIsComplete(
            fluoridationExaminationResult.isFluorideVarnishApplied(),
            prophylaxisSession.hasFluoridationVarnish(),
            currentFluoridationConsent);
      } else if (result instanceof ScreeningExaminationResult screeningExaminationResult) {
        validateFluoridationIsComplete(
            screeningExaminationResult.isFluorideVarnishApplied(),
            prophylaxisSession.hasFluoridationVarnish(),
            currentFluoridationConsent);
        validateScreeningIsComplete(screeningExaminationResult);
      }
    }
  }

  private static void validateFluoridationIsComplete(
      Boolean isFluorideVarnishApplied,
      boolean isExaminationWithFluoridation,
      FluoridationConsent currentFluoridationConsent) {
    if (isFluorideVarnishApplied == null
        && isExaminationWithFluoridation
        && currentFluoridationConsent != null
        && currentFluoridationConsent.isConsented()) {
      throw new BadRequestException(PROPHYLAXIS_SESSION_INCOMPLETE_MESSAGE);
    }
  }

  private static void validateScreeningIsComplete(ScreeningExaminationResult result) {
    for (ToothDiagnosis diagnosis : result.getToothDiagnoses().values()) {
      if (!hasMainResult(diagnosis)) {
        throw new BadRequestException(PROPHYLAXIS_SESSION_INCOMPLETE_MESSAGE);
      }
    }
  }

  private static boolean hasMainResult(ToothDiagnosis diagnosis) {
    return (diagnosis != null && diagnosis.mainResult() != null);
  }

  public void validateDentitionType(DentitionTypeDto dentitionType, boolean isScreening) {
    boolean hasDentitionType = dentitionType != null;
    if (isScreening && !hasDentitionType) {
      throw new BadRequestException("Dentition type is mandatory for screening sessions.");
    } else if (!isScreening && hasDentitionType) {
      throw new BadRequestException("Dentition type is not allowed for non-screening sessions.");
    }
  }

  public static void validateLabelsExist(List<UUID> requestLabels, List<UUID> persistedLabels) {
    List<UUID> inexistentLabels =
        requestLabels.stream()
            .distinct()
            .filter(label -> !persistedLabels.contains(label))
            .toList();
    if (!inexistentLabels.isEmpty()) {
      throw new BadRequestException("Invalid labels: %s".formatted(inexistentLabels));
    }
  }

  public static void validateAllChildrenAreOpenAndOfYear(List<Child> childrenToClose, Year year) {
    List<UUID> childrenNotInCurrentSchoolYear =
        childrenToClose.stream()
            .filter(
                child ->
                    !(child.getYear().equals(year)
                        && child.getProcedureStatus().equals(ProcedureStatus.OPEN)))
            .map(SequencedBaseEntityWithExternalId::getExternalId)
            .toList();
    if (!childrenNotInCurrentSchoolYear.isEmpty()) {
      throw new BadRequestException(
          "Not all children are open procedures and of current year: "
              + childrenNotInCurrentSchoolYear);
    }
  }

  public static void validateUniquenessOfOriginGroupNames(List<GroupPromotionDto> groupPromotions) {
    Set<String> elements = new HashSet<>();
    List<String> duplicatedGroups =
        groupPromotions.stream()
            .map(GroupPromotionDto::originGroupName)
            .filter(groupName -> !elements.add(groupName))
            .toList();

    if (!duplicatedGroups.isEmpty()) {
      throw new BadRequestException(
          "Duplicate origin group names are not allowed: "
              + StringUtils.join(duplicatedGroups, ", "));
    }
  }
}

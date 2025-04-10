/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import static de.eshg.measlesprotection.pdf.coverletter.CoverLetterPersonMapper.createAffectedPerson;
import static de.eshg.measlesprotection.pdf.coverletter.CoverLetterType.FIRST_LETTER_CHILD_DAY_CARE;
import static de.eshg.measlesprotection.pdf.coverletter.CoverLetterType.FIRST_LETTER_EMPLOYEE;
import static de.eshg.measlesprotection.pdf.coverletter.CoverLetterType.FIRST_LETTER_STUDENT_MINOR;
import static de.eshg.measlesprotection.pdf.coverletter.CoverLetterType.FIRST_LETTER_STUDENT_OF_AGE;
import static de.eshg.measlesprotection.pdf.coverletter.CoverLetterType.SECOND_LETTER_CHILD_DAY_CARE;
import static de.eshg.measlesprotection.pdf.coverletter.CoverLetterType.SECOND_LETTER_EMPLOYEE;
import static de.eshg.measlesprotection.pdf.coverletter.CoverLetterType.SECOND_LETTER_STUDENT_MINOR;
import static de.eshg.measlesprotection.pdf.coverletter.CoverLetterType.SECOND_LETTER_STUDENT_OF_AGE;
import static de.eshg.measlesprotection.pdf.coverletter.DepartmentInfoMapper.toDepartmentInfo;
import static de.eshg.measlesprotection.persistence.support.MeaslesProtectionSystemProgressEntryType.PROOF_REQUEST_LETTER_SAVED;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.config.departmentinfo.DepartmentInfoConfigService;
import de.eshg.lib.document.generator.department.DepartmentClient;
import de.eshg.lib.document.generator.department.DepartmentLogo;
import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.ProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.measlesprotection.api.AffectedPersonDto;
import de.eshg.measlesprotection.api.CustodianDto;
import de.eshg.measlesprotection.api.ProofRequestLetterRequest;
import de.eshg.measlesprotection.api.SaveProofRequestLetterRequest;
import de.eshg.measlesprotection.config.DateTimeConstants;
import de.eshg.measlesprotection.mapper.ToDtoMappers;
import de.eshg.measlesprotection.pdf.coverletter.CoverLetterBody;
import de.eshg.measlesprotection.pdf.coverletter.CoverLetterData;
import de.eshg.measlesprotection.pdf.coverletter.CoverLetterPerson;
import de.eshg.measlesprotection.pdf.coverletter.CoverLetterPersonMapper;
import de.eshg.measlesprotection.pdf.coverletter.CoverLetterService;
import de.eshg.measlesprotection.pdf.coverletter.CoverLetterType;
import de.eshg.measlesprotection.pdf.coverletter.DepartmentInfo;
import de.eshg.measlesprotection.persistence.centralfile.ProcedureDetailsData;
import de.eshg.measlesprotection.persistence.db.LetterType;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.measlesprotection.persistence.db.ProofRequestLetter;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Clock;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProofRequestLetterService {

  private final CoverLetterService coverLetterService;
  private final MeaslesProtectionService measlesProtectionService;
  private final DepartmentClient departmentClient;
  private final DepartmentInfoConfigService departmentInfoConfigService;
  private final Clock clock;

  public ProofRequestLetterService(
      CoverLetterService coverLetterService,
      MeaslesProtectionService measlesProtectionService,
      DepartmentClient departmentClient,
      DepartmentInfoConfigService departmentInfoConfigService,
      Clock clock) {
    this.coverLetterService = coverLetterService;
    this.measlesProtectionService = measlesProtectionService;
    this.departmentClient = departmentClient;
    this.departmentInfoConfigService = departmentInfoConfigService;
    this.clock = clock;
  }

  @Transactional(readOnly = true)
  public Pdf createCoverLetter(UUID id, ProofRequestLetterRequest request) {
    ProcedureDetailsData procedure =
        measlesProtectionService.findAndAugmentProcedureByExternalId(id);
    return doCreateCoverLetter(request, procedure);
  }

  private Pdf doCreateCoverLetter(
      ProofRequestLetterRequest request, ProcedureDetailsData procedureDetails) {
    AffectedPersonDto person = ToDtoMappers.toAffectedPersonDto(procedureDetails);

    LocalDate previousLetterDate = previousLetterDate(procedureDetails, request);
    CoverLetterType letterType = coverLetterType(person, procedureDetails, request);
    CoverLetterPerson addressee = createAddressee(request, procedureDetails, person);
    CoverLetterPerson affectedPerson = createAffectedPerson(person);
    CoverLetterBody body = createLetterBody(request, previousLetterDate);
    DepartmentLogo departmentLogo = departmentClient.getDepartmentLogo();
    DepartmentInfo departmentInfo =
        toDepartmentInfo(departmentInfoConfigService.getDepartmentInfo());
    CoverLetterData data =
        new CoverLetterData(
            letterType, addressee, affectedPerson, body, departmentLogo, departmentInfo);
    return coverLetterService.createCoverLetter(data);
  }

  private LocalDate previousLetterDate(
      ProcedureDetailsData procedureDetails, ProofRequestLetterRequest request) {
    List<ProofRequestLetter> letters = getProofRequestLetters(procedureDetails, request);
    if (letters.isEmpty()) {
      return null;
    } else {
      return letters.getLast().getCreatedAt().atZone(clock.getZone()).toLocalDate();
    }
  }

  private static List<ProofRequestLetter> getProofRequestLetters(
      ProcedureDetailsData procedureDetails, ProofRequestLetterRequest request) {
    UUID recipientId = request.recipientId();
    LetterType letterType = getLetterType(recipientId, procedureDetails);
    return procedureDetails.procedure().getProofRequestLetters().stream()
        .filter(letter -> letter.getRecipientId().equals(recipientId))
        .filter(letter -> letter.getLetterType() == letterType)
        .toList();
  }

  private static LetterType getLetterType(UUID recipientId, ProcedureDetailsData procedureDetails) {
    return getLetterType(recipientId, procedureDetails.procedure());
  }

  private static LetterType getLetterType(UUID recipientId, MeaslesProtectionProcedure procedure) {
    if (recipientId.equals(procedure.getPatientIdFromCentralFile())) {
      return LetterType.LETTER_TO_PATIENT;
    } else if (procedure.getCustodianIdsFromCentralFile().stream()
        .anyMatch(id -> id.equals(recipientId))) {
      return LetterType.LETTER_TO_CUSTODIANS;
    } else {
      throw new BadRequestException(
          recipientId + ": The recipient ID is not related to an affected person or a custodian.");
    }
  }

  private CoverLetterBody createLetterBody(
      ProofRequestLetterRequest request, LocalDate previousLetterDate) {
    return new CoverLetterBody(request.deadline(), LocalDate.now(clock), previousLetterDate);
  }

  private static CoverLetterPerson createAddressee(
      ProofRequestLetterRequest request,
      ProcedureDetailsData procedureDetails,
      AffectedPersonDto person) {

    UUID recipientId = request.recipientId();
    LetterType letterType = getLetterType(recipientId, procedureDetails);
    return switch (letterType) {
      case LETTER_TO_PATIENT -> CoverLetterPersonMapper.createAddressee(person);
      case LETTER_TO_CUSTODIANS ->
          CoverLetterPersonMapper.createAddressee(findCustodian(procedureDetails, recipientId));
      default ->
          throw new BadRequestException(
              "The letter type is not valid in this context: " + letterType);
    };
  }

  private static CustodianDto findCustodian(ProcedureDetailsData procedure, UUID custodianId) {
    GetPersonFileStateResponse personFileState =
        procedure.custodians().stream()
            .filter(custodian -> custodian.id().equals(custodianId))
            .collect(StreamUtil.toSingleOptionalElement())
            .orElseThrow(() -> new NotFoundException("No such custodian"));

    return ToDtoMappers.toCustodianDto(personFileState);
  }

  private static CoverLetterType coverLetterType(
      AffectedPersonDto person,
      ProcedureDetailsData procedureDetails,
      ProofRequestLetterRequest request) {
    boolean isFirstLetter = getProofRequestLetters(procedureDetails, request).isEmpty();
    final CoverLetterType letterType;
    if (isFirstLetter) {
      letterType =
          getCoverLetterType(
              person,
              procedureDetails,
              FIRST_LETTER_EMPLOYEE,
              FIRST_LETTER_STUDENT_OF_AGE,
              FIRST_LETTER_STUDENT_MINOR,
              FIRST_LETTER_CHILD_DAY_CARE);
    } else {
      letterType =
          getCoverLetterType(
              person,
              procedureDetails,
              SECOND_LETTER_EMPLOYEE,
              SECOND_LETTER_STUDENT_OF_AGE,
              SECOND_LETTER_STUDENT_MINOR,
              SECOND_LETTER_CHILD_DAY_CARE);
    }
    return letterType;
  }

  private static CoverLetterType getCoverLetterType(
      AffectedPersonDto person,
      ProcedureDetailsData procedureDetails,
      CoverLetterType employee,
      CoverLetterType studentOfAge,
      CoverLetterType studentMinor,
      CoverLetterType childDaycare) {
    final CoverLetterType letterType;
    switch (person.roleStatus()) {
      case EMPLOYEE -> letterType = employee;
      case SUPERVISED -> {
        switch (procedureDetails.facilityData().facilityType()) {
          case SCHOOL -> {
            if (person.isAdult()) {
              letterType = studentOfAge;
            } else {
              letterType = studentMinor;
            }
          }
          case DAY_NURSERY, DAYCARE, CHILDRENS_HOME -> letterType = childDaycare;
          default -> letterType = employee;
        }
      }
      default -> throw new IllegalStateException("Unexpected role status: " + person.roleStatus());
    }
    return letterType;
  }

  @Transactional
  public void saveCoverLetter(UUID id, SaveProofRequestLetterRequest request) {
    ProcedureDetailsData procedureDetails =
        measlesProtectionService.findAndAugmentProcedureByExternalId(id);
    MeaslesProtectionProcedure procedure = procedureDetails.procedure();
    Pdf pdf = doCreateCoverLetter(request, procedureDetails);
    addProgressEntry(procedure, pdf);
    addProofRequestLetter(procedure, pdf, request);
  }

  private static void addProofRequestLetter(
      MeaslesProtectionProcedure procedure, Pdf pdf, SaveProofRequestLetterRequest request) {
    ProofRequestLetter letter = new ProofRequestLetter();
    letter.setLetterType(getLetterType(request.recipientId(), procedure));
    letter.setRecipientId(request.recipientId());
    letter.setDeadline(request.deadline());
    letter.setPdf(pdf);
    procedure.addProofRequestLetter(letter);
  }

  private void addProgressEntry(MeaslesProtectionProcedure procedure, Pdf pdf) {
    ZonedDateTime createdDate = pdf.getMetaData().getCreatedDate().atZone(clock.getZone());
    String changeDescription =
        "Immunitätsnachweis im Sinne des Masernschutzgesetzes am %s angefordert."
            .formatted(createdDate.format(DateTimeConstants.DATE_FORMAT_DE));
    ProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            PROOF_REQUEST_LETTER_SAVED.name(), changeDescription, TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setFile(pdf);
    procedure.addProgressEntry(progressEntry);
  }
}

/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import static de.eshg.measlesprotection.persistence.support.MeaslesProtectionSystemProgressEntryType.ACCESS_RESTRICTION_ISSUED;
import static de.eshg.measlesprotection.persistence.support.MeaslesProtectionSystemProgressEntryType.ACCESS_RESTRICTION_UPDATED;

import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.lib.procedure.mapping.ProgressEntryMapper;
import de.eshg.lib.procedure.model.CreateManualProgressEntryRequest;
import de.eshg.lib.procedure.model.FileMetaDataDto;
import de.eshg.lib.procedure.model.ManualProgressEntryTypeDto;
import de.eshg.lib.procedure.progressentry.ProgressEntryService;
import de.eshg.measlesprotection.api.CreateAccessRestrictionDto;
import de.eshg.measlesprotection.api.CreateAccessRestrictionLetterDto;
import de.eshg.measlesprotection.api.UpdateAccessRestrictionDto;
import de.eshg.measlesprotection.config.DateTimeConstants;
import de.eshg.measlesprotection.persistence.db.AccessRestriction;
import de.eshg.measlesprotection.persistence.db.AccessRestrictionLetter;
import de.eshg.measlesprotection.persistence.db.LetterStatus;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.rest.service.error.NotFoundException;
import java.io.IOException;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AccessRestrictionService {

  private final ProgressEntryService<MeaslesProtectionProcedure> progressEntryService;
  private final ProcedureFinder procedureFinder;

  public AccessRestrictionService(
      ProgressEntryService<MeaslesProtectionProcedure> progressEntryService,
      ProcedureFinder procedureFinder) {
    this.progressEntryService = progressEntryService;
    this.procedureFinder = procedureFinder;
  }

  public AccessRestriction createAccessRestriction(
      UUID procedureId, CreateAccessRestrictionDto request) {
    MeaslesProtectionProcedure procedure = procedureFinder.findProcedureByExternalId(procedureId);

    AccessRestriction accessRestriction = createAccessRestriction(procedure, request);
    accessRestriction.setProcedure(procedure);
    procedure.setAccessRestriction(accessRestriction);
    return accessRestriction;
  }

  private AccessRestriction createAccessRestriction(
      MeaslesProtectionProcedure procedure, CreateAccessRestrictionDto request) {

    AccessRestriction accessRestriction = new AccessRestriction();
    accessRestriction.setRestrictionIssuedDate(request.restrictionIssuedDate());
    accessRestriction.setRestrictionStartDate(request.restrictionStartDate());
    accessRestriction.setRestrictionTerminationDate(request.restrictionTerminationDate());
    addInitialProgressEntry(procedure, accessRestriction);

    return accessRestriction;
  }

  public AccessRestriction updateAccessRestriction(
      UUID procedureId, UpdateAccessRestrictionDto request) {
    MeaslesProtectionProcedure procedure = procedureFinder.findProcedureByExternalId(procedureId);
    AccessRestriction accessRestriction = procedure.getAccessRestriction();
    accessRestriction.setRestrictionTerminationDate(request.restrictionTerminationDate());
    addUpdateProgressEntry(procedure, accessRestriction);

    return accessRestriction;
  }

  private void addInitialProgressEntry(
      MeaslesProtectionProcedure procedure, AccessRestriction accessRestriction) {
    SystemProgressEntry initialSystemProgressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            ACCESS_RESTRICTION_ISSUED.name(),
            createInitialProgressEntryDescription(accessRestriction),
            TriggerType.SYSTEM_AUTOMATIC);
    initialSystemProgressEntry.setProcedureId(procedure.getId());
    accessRestriction.setProgressEntry(initialSystemProgressEntry);
    procedure.addProgressEntry(initialSystemProgressEntry);
  }

  private void addUpdateProgressEntry(
      MeaslesProtectionProcedure procedure, AccessRestriction accessRestriction) {
    SystemProgressEntry initialSystemProgressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            ACCESS_RESTRICTION_UPDATED.name(),
            "Das Betretungsverbot wurde bearbeitet.",
            TriggerType.SYSTEM_AUTOMATIC);
    initialSystemProgressEntry.setProcedureId(procedure.getId());
    accessRestriction.setProgressEntry(initialSystemProgressEntry);
    procedure.addProgressEntry(initialSystemProgressEntry);
  }

  private String createInitialProgressEntryDescription(AccessRestriction accessRestriction) {
    return "Das Betretungsverbot wurde am %s erstellt. Es ist ab dem %s wirksam."
        .formatted(
            accessRestriction.getRestrictionIssuedDate().format(DateTimeConstants.DATE_FORMAT_DE),
            accessRestriction.getRestrictionStartDate().format(DateTimeConstants.DATE_FORMAT_DE));
  }

  public AccessRestrictionLetter createAccessRestrictionLetter(
      UUID procedureId,
      CreateAccessRestrictionLetterDto request,
      MultipartFile file,
      FileMetaDataDto fileMetaData)
      throws IOException {
    MeaslesProtectionProcedure procedure = procedureFinder.findProcedureByExternalId(procedureId);

    if (procedure.getAccessRestriction() == null) {
      throw new NotFoundException("Procedure with with given UUID has no AccessRestriction");
    }

    // Todo: check if recipient id is one of related persons of procedure
    AccessRestrictionLetter letter = createLetter(procedure, request, file, fileMetaData);
    letter.setAccessRestriction(procedure.getAccessRestriction());
    procedure.getAccessRestriction().addLetter(letter);
    return letter;
  }

  private AccessRestrictionLetter createLetter(
      MeaslesProtectionProcedure procedure,
      CreateAccessRestrictionLetterDto request,
      MultipartFile file,
      FileMetaDataDto fileMetaData)
      throws IOException {

    LetterStatus letterStatus = file != null ? LetterStatus.UPLOADED : LetterStatus.GENERATED;
    AccessRestrictionLetter letter = new AccessRestrictionLetter();
    letter.setRecipientId(request.recipientId());
    letter.setSentAt(request.sentAt());
    letter.setLetterStatus(letterStatus);

    if (letterStatus == LetterStatus.UPLOADED) {
      ManualProgressEntry fileUploadProgressEntry =
          createProgressEntryWithFileAttached(procedure, file, fileMetaData, "hochgeladen");
      letter.setProgressEntry(fileUploadProgressEntry);
    } else {
      ManualProgressEntry fileGeneratedProgressEntry =
          createProgressEntryWithFileAttached(procedure, null, null, "generiert");
      letter.setProgressEntry(fileGeneratedProgressEntry);
    }

    return letter;
  }

  private ManualProgressEntry createProgressEntryWithFileAttached(
      MeaslesProtectionProcedure procedure,
      MultipartFile file,
      FileMetaDataDto fileMetaData,
      String producedHow)
      throws IOException {
    CreateManualProgressEntryRequest createManualProgressEntryRequest =
        new CreateManualProgressEntryRequest(
            ManualProgressEntryTypeDto.LETTER,
            "Ein Anschreiben über ein Betretungsverbot wurde %s.".formatted(producedHow),
            null);

    return progressEntryService.addManualProgressEntry(
        procedure.getExternalId(),
        ProgressEntryMapper.toDomainType(createManualProgressEntryRequest),
        file,
        fileMetaData);
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import static de.eshg.measlesprotection.persistence.support.MeaslesProtectionSystemProgressEntryType.PROOF_SUBMITTED;

import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry;
import de.eshg.lib.procedure.domain.model.ManualProgressEntryType;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.lib.procedure.model.FileMetaDataDto;
import de.eshg.lib.procedure.progressentry.ProgressEntryService;
import de.eshg.measlesprotection.api.CreateProofSubmissionDto;
import de.eshg.measlesprotection.api.UpdateProofSubmissionDto;
import de.eshg.measlesprotection.config.DateTimeConstants;
import de.eshg.measlesprotection.mapper.ProofSubmissionMapper;
import de.eshg.measlesprotection.mapper.SubmissionResultMapper;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.measlesprotection.persistence.db.ProofSubmission;
import de.eshg.measlesprotection.persistence.db.SubmissionResult;
import de.eshg.rest.service.error.NotFoundException;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProofSubmissionService {
  private final ProcedureFinder procedureFinder;
  private final ProgressEntryService<MeaslesProtectionProcedure> progressEntryService;

  public ProofSubmissionService(
      ProcedureFinder procedureFinder,
      ProgressEntryService<MeaslesProtectionProcedure> progressEntryService) {
    this.procedureFinder = procedureFinder;
    this.progressEntryService = progressEntryService;
  }

  @Transactional
  public ProofSubmission createProofSubmission(
      UUID procedureId,
      CreateProofSubmissionDto request,
      MultipartFile file,
      @Valid FileMetaDataDto fileMetaData)
      throws IOException {
    MeaslesProtectionProcedure procedure = procedureFinder.findProcedureByExternalId(procedureId);

    ProofSubmission proofSubmission = ProofSubmissionMapper.toDatabaseType(request);
    procedure.addProofSubmission(proofSubmission);

    addInitialProgressEntry(procedure, proofSubmission);

    handleDocumentUpload(procedureId, file, fileMetaData, proofSubmission);

    return proofSubmission;
  }

  private void handleDocumentUpload(
      UUID procedureId,
      MultipartFile file,
      FileMetaDataDto fileMetaData,
      ProofSubmission proofSubmission)
      throws IOException {
    if (file == null || file.isEmpty()) {
      return;
    }
    ManualProgressEntry manualProgressEntry = new ManualProgressEntry();
    manualProgressEntry.setManualProgressEntryType(ManualProgressEntryType.DOCUMENT);
    progressEntryService.addManualProgressEntry(
        procedureId, manualProgressEntry, file, fileMetaData);
    proofSubmission.setManualProgressEntry(manualProgressEntry);
  }

  private void addInitialProgressEntry(
      MeaslesProtectionProcedure procedure, ProofSubmission proofSubmission) {
    SystemProgressEntry initialProgressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            PROOF_SUBMITTED.name(),
            createInitialProgressEntryDescription(proofSubmission),
            TriggerType.SYSTEM_AUTOMATIC);
    procedure.addProgressEntry(initialProgressEntry);
  }

  private String createInitialProgressEntryDescription(ProofSubmission proofSubmission) {
    return "Eine Nachweisvorlage wurde am %s mit dem Resultat '%s' eingetragen."
        .formatted(
            proofSubmission.getSubmissionDate().format(DateTimeConstants.DATE_FORMAT_DE),
            proofSubmission.getSubmissionResult().getDisplayText());
  }

  @Transactional
  public ProofSubmission updateProofSubmission(
      UUID id, UUID proofSubmissionId, UpdateProofSubmissionDto updateProofSubmission) {
    MeaslesProtectionProcedure procedure = procedureFinder.findProcedureByExternalId(id);
    ProofSubmission currentProofSubmission =
        procedure.getProofSubmissions().stream()
            .filter(ps -> ps.getExternalId().equals(proofSubmissionId))
            .findAny()
            .orElseThrow(
                () ->
                    new NotFoundException(
                        "ProofSubmission with UUID %s not found".formatted(proofSubmissionId)));

    updateProofSubmission(currentProofSubmission, updateProofSubmission);

    return currentProofSubmission;
  }

  private void updateProofSubmission(
      ProofSubmission currentProofSubmission, UpdateProofSubmissionDto updateProofSubmission) {
    if (updateProofSubmission.submissionResult() != null) {
      updateProofSubmissionResult(currentProofSubmission, updateProofSubmission);
    }
    if (updateProofSubmission.medicalAttestDeadline() != null) {
      updateProofSubmissionMedicalAttestDeadline(currentProofSubmission, updateProofSubmission);
    }
    if (updateProofSubmission.submissionDate() != null) {
      currentProofSubmission.setSubmissionDate(updateProofSubmission.submissionDate());
    }
  }

  private void updateProofSubmissionMedicalAttestDeadline(
      ProofSubmission currentProofSubmission, UpdateProofSubmissionDto updateProofSubmission) {
    if (currentProofSubmission.getSubmissionResult() != SubmissionResult.TEMP_MEDICAL_ATTEST) {
      throw new IllegalStateException(
          "medicalAttestDeadline is only allowed for TEMP_MEDICAL_ATTEST");
    }
    currentProofSubmission.setMedicalAttestDeadline(updateProofSubmission.medicalAttestDeadline());
  }

  private void updateProofSubmissionResult(
      ProofSubmission currentProofSubmission, UpdateProofSubmissionDto updateProofSubmission) {
    SubmissionResult updateSubmissionResult =
        SubmissionResultMapper.toDatabaseType(updateProofSubmission.submissionResult());
    if (currentProofSubmission.getSubmissionResult() == updateSubmissionResult) {
      return;
    }
    if (currentProofSubmission.getSubmissionResult() == SubmissionResult.TEMP_MEDICAL_ATTEST
        && updateSubmissionResult != SubmissionResult.TEMP_MEDICAL_ATTEST) {
      currentProofSubmission.setMedicalAttestDeadline(null);
    }
    currentProofSubmission.setSubmissionResult(updateSubmissionResult);
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.mapper;

import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry;
import de.eshg.measlesprotection.api.CreateProofSubmissionDto;
import de.eshg.measlesprotection.api.ProofSubmissionDto;
import de.eshg.measlesprotection.persistence.db.ProofSubmission;
import java.util.List;
import java.util.UUID;

public class ProofSubmissionMapper {

  private ProofSubmissionMapper() {}

  public static ProofSubmission toDatabaseType(CreateProofSubmissionDto proofSubmissionDto) {
    ProofSubmission proofSubmission = new ProofSubmission();
    proofSubmission.setSubmissionResult(
        SubmissionResultMapper.toDatabaseType(proofSubmissionDto.submissionResult()));
    proofSubmission.setSubmissionDate(proofSubmissionDto.submissionDate());
    proofSubmission.setMedicalAttestDeadline(proofSubmissionDto.medicalAttestDeadline());
    return proofSubmission;
  }

  public static ProofSubmissionDto toInterfaceType(ProofSubmission proofSubmission) {
    ManualProgressEntry manualProgressEntry = proofSubmission.getManualProgressEntry();
    UUID proofSubmissionDocumentId = null;
    if (manualProgressEntry != null) {
      File file = manualProgressEntry.getFile();
      if (file != null && !file.isDeleted()) {
        proofSubmissionDocumentId = file.getExternalId();
      }
    }
    return new ProofSubmissionDto(
        proofSubmission.getExternalId(),
        SubmissionResultMapper.toInterfaceType(proofSubmission.getSubmissionResult()),
        proofSubmission.getSubmissionDate(),
        proofSubmission.getMedicalAttestDeadline(),
        proofSubmissionDocumentId);
  }

  public static List<ProofSubmissionDto> toInterfaceType(List<ProofSubmission> proofSubmissions) {
    return proofSubmissions.stream().map(ProofSubmissionMapper::toInterfaceType).toList();
  }
}

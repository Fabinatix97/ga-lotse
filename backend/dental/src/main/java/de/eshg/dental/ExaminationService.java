/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import de.eshg.dental.api.UpdateExaminationRequest;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.repository.ExaminationRepository;
import de.eshg.dental.util.ChildSystemProgressEntryType;
import de.eshg.dental.util.ExceptionUtil;
import de.eshg.dental.util.ProgressEntryUtil;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.validation.ValidationUtil;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class ExaminationService {

  private final ExaminationRepository examinationRepository;
  private final ProgressEntryUtil progressEntryUtil;

  public ExaminationService(
      ExaminationRepository examinationRepository, ProgressEntryUtil progressEntryUtil) {
    this.examinationRepository = examinationRepository;
    this.progressEntryUtil = progressEntryUtil;
  }

  Examination findExamination(UUID examinationId) {
    return examinationRepository
        .findByExternalId(examinationId)
        .orElseThrow(ExaminationService::examinationNotFoundException);
  }

  Examination findExaminationForUpdate(UUID examinationId) {
    return examinationRepository
        .findOneByExternalIdForUpdate(examinationId)
        .orElseThrow(ExaminationService::examinationNotFoundException);
  }

  void updateExamination(Examination examination, UpdateExaminationRequest request) {
    ValidationUtil.validateVersion(request.version(), examination);
    examination.setNote(request.note());
    progressEntryUtil.addSystemProgressEntry(
        examination.getChild(), ChildSystemProgressEntryType.EXAMINATION_MODIFIED);
    examinationRepository.flush();
  }

  private static NotFoundException examinationNotFoundException() {
    return ExceptionUtil.notFoundException(Examination.class);
  }
}

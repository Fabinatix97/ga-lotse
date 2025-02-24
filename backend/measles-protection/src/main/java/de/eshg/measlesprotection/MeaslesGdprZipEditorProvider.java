/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.domain.model.serialization.ZipEditor;
import de.eshg.lib.procedure.gdpr.AbstractGdprZipEditorProvider;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure_;
import de.eshg.measlesprotection.persistence.db.ProofSubmission_;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
public class MeaslesGdprZipEditorProvider extends AbstractGdprZipEditorProvider {

  public MeaslesGdprZipEditorProvider(
      @Value("classpath:/gdpr-legal-basis-text.txt") Resource resource) {
    super(resource);
  }

  @Override
  protected ZipEditor createSpecificFilter() {
    return removeFieldFromArray(
        ProofSubmission_.MANUAL_PROGRESS_ENTRY, MeaslesProtectionProcedure_.PROOF_SUBMISSIONS);
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental;

import de.eshg.dental.domain.model.Child_;
import de.eshg.domain.model.serialization.ZipEditor;
import de.eshg.lib.procedure.gdpr.AbstractGdprZipEditorProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
public class DentalGdprZipEditorProvider extends AbstractGdprZipEditorProvider {

  // TODO (ISSUE-7442): Replace text for legal basis in the file below
  public DentalGdprZipEditorProvider(
      @Value("classpath:/gdpr-legal-basis-text.txt") Resource resource) {
    super(resource);
  }

  @Override
  protected ZipEditor createSpecificFilter() {
    return removeFieldFromArray(Child_.NOTE, Child_.EXAMINATIONS);
  }
}

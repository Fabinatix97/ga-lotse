/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice;

import de.eshg.domain.model.serialization.ZipEditor;
import de.eshg.lib.procedure.gdpr.AbstractGdprZipEditorProvider;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure_;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
public class OmsGdprZipEditorProvider extends AbstractGdprZipEditorProvider {

  // TODO (ISSUE-7443): Replace text for legal basis in the file below
  public OmsGdprZipEditorProvider(
      @Value("classpath:/gdpr-legal-basis-text.txt") Resource resource) {
    super(resource);
  }

  @Override
  protected ZipEditor createSpecificFilter() {
    return removeFieldFromPath(OmsProcedure_.PHYSICIAN_ID);
  }
}

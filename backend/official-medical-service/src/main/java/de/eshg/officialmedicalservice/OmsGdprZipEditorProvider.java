/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice;

import de.eshg.domain.model.serialization.ZipEditor;
import de.eshg.lib.procedure.gdpr.AbstractGdprZipEditorProvider;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure_;
import org.springframework.stereotype.Component;

@Component
public class OmsGdprZipEditorProvider extends AbstractGdprZipEditorProvider {

  @Override
  protected String getLegalBasisAppendix() {
    return "Hier könnte Ihr Rechtsgrundlagen-Anhang stehen!";
  }

  @Override
  protected ZipEditor createSpecificFilter() {
    return removeFieldFromPath(OmsProcedure_.PHYSICIAN_ID);
  }
}

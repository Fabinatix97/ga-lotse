/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import de.eshg.dental.domain.model.Child_;
import de.eshg.dental.domain.model.Examination_;
import de.eshg.domain.model.serialization.ZipEditor;
import de.eshg.lib.procedure.gdpr.AbstractGdprZipEditorProvider;
import org.springframework.stereotype.Component;

@Component
public class DentalGdprZipEditorProvider extends AbstractGdprZipEditorProvider {

  @Override
  protected String getLegalBasisAppendix() {
    return "Hier könnte Ihr Rechtsgrundlagen-Anhang stehen!";
  }

  @Override
  protected ZipEditor createSpecificFilter() {
    return removeFieldFromArray(Examination_.NOTE, Child_.EXAMINATIONS);
  }
}

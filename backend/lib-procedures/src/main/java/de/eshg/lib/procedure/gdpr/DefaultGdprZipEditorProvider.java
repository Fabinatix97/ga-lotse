/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.gdpr;

import de.eshg.domain.model.serialization.ZipEditor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnMissingBean(AbstractGdprZipEditorProvider.class)
public class DefaultGdprZipEditorProvider extends AbstractGdprZipEditorProvider {

  protected ZipEditor createSpecificFilter() {
    return (jsonNode, zipFileWrapper) -> {};
  }

  protected String getLegalBasisAppendix() {
    return "";
  }
}

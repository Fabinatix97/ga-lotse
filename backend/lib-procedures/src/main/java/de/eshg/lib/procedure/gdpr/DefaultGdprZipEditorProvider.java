/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.gdpr;

import de.eshg.domain.model.serialization.ZipEditor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnMissingBean(AbstractGdprZipEditorProvider.class)
public class DefaultGdprZipEditorProvider extends AbstractGdprZipEditorProvider {

  public DefaultGdprZipEditorProvider(
      @Value("classpath:/gdpr-legal-basis-text.txt") Resource resource) {
    super(resource);
  }

  @Override
  protected ZipEditor createSpecificFilter() {
    return (jsonNode, zipFileWrapper) -> {};
  }
}

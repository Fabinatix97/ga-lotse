/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.department;

import static de.eshg.util.ResourceUtils.assertIsReadable;

import de.eshg.rest.service.i18n.Language;
import jakarta.validation.constraints.NotNull;
import java.io.IOException;
import java.io.UncheckedIOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
record ReleaseNotesLoader(
    @NotNull @Value("classpath:release-notes-de.md") Resource releaseNotesDe,
    @Value("classpath:release-nodes-en.md") Resource releaseNotesEn) {
  ReleaseNotesLoader {
    assertIsReadable(releaseNotesDe, "release notes (german)");
    if (releaseNotesEn.exists()) {
      assertIsReadable(releaseNotesEn, "release notes (english)");
    }
  }

  byte[] getReleaseNotesWithGermanFallback(Language language) {
    if (language == Language.ENGLISH && releaseNotesEn.exists()) {
      return asByteArray(releaseNotesEn);
    } else {
      return asByteArray(releaseNotesDe);
    }
  }

  private byte[] asByteArray(Resource resource) {
    try {
      return resource.getContentAsByteArray();
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }
}

/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.base.config.api.CitizenAndEmployeeMarkdownInfo;
import de.eshg.base.config.api.InternationalMarkdownInfo;
import de.eshg.base.config.api.MarkdownInfo;
import de.eshg.base.department.LanguageDto;
import de.eshg.base.department.MarkdownName;
import de.eshg.config.domain.MultiLangDocument;
import org.springframework.stereotype.Component;

@Component
public class MarkdownMapper {
  public CitizenAndEmployeeMarkdownInfo citizenAndEmployeeMarkdownInfoOf(
      MultiLangDocument citizen,
      MarkdownName citizenMarkdownName,
      MultiLangDocument employee,
      MarkdownName employeeMarkdownName) {
    return new CitizenAndEmployeeMarkdownInfo(
        internationalMarkdownInfoOf(citizen, citizenMarkdownName),
        internationalMarkdownInfoOf(employee, employeeMarkdownName));
  }

  public InternationalMarkdownInfo internationalMarkdownInfoOf(
      MultiLangDocument document, MarkdownName markdownName) {
    return new InternationalMarkdownInfo(
        germanMarkdownInfoOf(document, markdownName),
        englishMarkdownInfoOf(document, markdownName));
  }

  public String getFileName(MarkdownName markdownName, LanguageDto language) {
    return markdownName.fileNameRoot() + language.fileNameSuffix() + ".md";
  }

  private MarkdownInfo germanMarkdownInfoOf(MultiLangDocument document, MarkdownName markdownName) {
    return new MarkdownInfo(
        getFileName(markdownName, LanguageDto.GERMAN), document.getDeFileSizeBytes());
  }

  private MarkdownInfo englishMarkdownInfoOf(
      MultiLangDocument document, MarkdownName markdownName) {
    if (document.getEnFileSizeBytes() == null) {
      return null;
    } else {
      return new MarkdownInfo(
          getFileName(markdownName, LanguageDto.ENGLISH), document.getEnFileSizeBytes());
    }
  }
}

/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.icd10.parser;

import de.eshg.schoolentry.domain.model.Icd10Code;
import de.eshg.schoolentry.domain.model.Icd10Group;
import java.util.List;

public record Icd10Data(List<Icd10Group> groups, List<Icd10Code> codes) {

  public record Icd10Group(String start, String end, String title) {
    static Icd10Group fromGroup(de.eshg.schoolentry.domain.model.Icd10Group group) {
      return new Icd10Group(group.getGroupStart(), group.getGroupEnd(), group.getTitle());
    }
  }

  public record Icd10Code(String code, String codeWithoutDot, String group, String title) {
    static Icd10Code fromCode(de.eshg.schoolentry.domain.model.Icd10Code code) {
      return new Icd10Code(
          code.getCode(),
          code.getCodeWithoutDot(),
          code.getGroup().getGroupStart(),
          code.getTitle());
    }
  }
}

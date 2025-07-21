/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.icd10.parser;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record Icd10Data(List<Icd10Group> groups, List<Icd10Code> codes) {

  public record Icd10Group(String start, String end, String title) {
    static Icd10Group fromGroup(de.eshg.base.icd10.persistence.entity.Icd10Group group) {
      return new Icd10Group(group.getGroupStart(), group.getGroupEnd(), group.getTitle());
    }
  }

  public record Icd10Code(
      @JsonProperty("code") String originalCode,
      @JsonProperty("codeWithoutDot") String code,
      String group,
      String title) {
    static Icd10Code fromCode(de.eshg.base.icd10.persistence.entity.Icd10Code code) {
      return new Icd10Code(
          code.getOriginalCode(), code.getCode(), code.getGroup().getGroupStart(), code.getTitle());
    }
  }
}

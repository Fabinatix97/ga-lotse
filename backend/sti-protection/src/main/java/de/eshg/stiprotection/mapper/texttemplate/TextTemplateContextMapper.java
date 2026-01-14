/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.texttemplate;

import de.eshg.stiprotection.api.texttemplate.TextTemplateContextDto;
import de.eshg.stiprotection.persistence.db.texttemplate.TextTemplateContext;

public class TextTemplateContextMapper {

  private TextTemplateContextMapper() {}

  public static TextTemplateContext toDatabaseType(TextTemplateContextDto dto) {
    return switch (dto) {
      case null -> throw new IllegalArgumentException("The dto to be mapped should not be null.");
      case CONSULTATION_REASON -> TextTemplateContext.CONSULTATION_REASON;
      case CONSULTATION_REMARK -> TextTemplateContext.CONSULTATION_REMARK;
      case RAPID_TESTS_REMARK -> TextTemplateContext.RAPID_TESTS_REMARK;
      case LABORATORY_TESTS_REMARK -> TextTemplateContext.LABORATORY_TESTS_REMARK;
      case DIAGNOSIS_RESULT -> TextTemplateContext.DIAGNOSIS_RESULT;
      case DIAGNOSIS_REMARK -> TextTemplateContext.DIAGNOSIS_REMARK;
    };
  }

  public static TextTemplateContextDto toInterfaceType(TextTemplateContext entity) {
    return switch (entity) {
      case null ->
          throw new IllegalArgumentException("The entity to be mapped should not be null.");
      case CONSULTATION_REASON -> TextTemplateContextDto.CONSULTATION_REASON;
      case CONSULTATION_REMARK -> TextTemplateContextDto.CONSULTATION_REMARK;
      case RAPID_TESTS_REMARK -> TextTemplateContextDto.RAPID_TESTS_REMARK;
      case LABORATORY_TESTS_REMARK -> TextTemplateContextDto.LABORATORY_TESTS_REMARK;
      case DIAGNOSIS_RESULT -> TextTemplateContextDto.DIAGNOSIS_RESULT;
      case DIAGNOSIS_REMARK -> TextTemplateContextDto.DIAGNOSIS_REMARK;
    };
  }
}

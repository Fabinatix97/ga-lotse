/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.texttemplate;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "TextTemplateContext")
public enum TextTemplateContextDto {
  CONSULTATION_REASON,
  CONSULTATION_REMARK,
  RAPID_TESTS_REMARK,
  LABORATORY_TESTS_REMARK,
  DIAGNOSIS_RESULT,
  DIAGNOSIS_REMARK
}

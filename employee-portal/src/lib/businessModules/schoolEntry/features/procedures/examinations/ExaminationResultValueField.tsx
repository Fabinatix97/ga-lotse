/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SoftRequiredSelectField,
  SoftRequiredSelectFieldProps,
} from "@eshg/lib-portal/businessModules/schoolEntry/features/procedures/fieldVariants";

import { EXAMINATION_RESULT_OPTIONS } from "@/lib/businessModules/schoolEntry/features/procedures/options";

export type ExaminationResultValueFieldProps = Omit<
  SoftRequiredSelectFieldProps<false>,
  "options"
>;

export function ExaminationResultValueField(
  props: ExaminationResultValueFieldProps,
) {
  return (
    <SoftRequiredSelectField {...props} options={EXAMINATION_RESULT_OPTIONS} />
  );
}

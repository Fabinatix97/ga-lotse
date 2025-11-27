/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFormikContext } from "formik";

import { useConfirmLeaveDirtyFormEffect } from "@eshg/lib-employee-portal";
import { OnBeforeNavigateProps } from "@eshg/lib-portal";

type ConfirmLeaveDirtyFormEffectProps = OnBeforeNavigateProps;

/**
 * Place this inside a Formik form to have it warn the user of unsaved data
 * being lost.
 *
 * ATTENTION:
 *
 * In its current implementation it checks the dirty state of the form.
 * This state does not change after submission of the form.
 * Meaning even after saving the data the user is still prompted to confirm
 * data loss.
 * Therefore, you have to reset the form manually on successful submission.
 * Check the second parameter of the Formik `onSubmit` callback.
 */
export function ConfirmLeaveDirtyFormEffect(
  props: ConfirmLeaveDirtyFormEffectProps,
) {
  const formik = useFormikContext();
  useConfirmLeaveDirtyFormEffect(formik.dirty, props);
  return null;
}

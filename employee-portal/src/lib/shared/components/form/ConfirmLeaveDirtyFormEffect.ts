/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useFormikContext } from "formik";

import { useConfirmNavigationEffect } from "@/lib/shared/hooks/useConfirmNavigationEffect";
import { useConfirmUnloadEffect } from "@/lib/shared/hooks/useConfirmUnloadEffect";

/**
 * Place this inside a Formik form to have it warn the user of unsaved data
 * being lost.
 *
 * ATTENTION:
 *
 * In it's current implementation it checks the dirty state of the form.
 * This state does not change after submission of the form.
 * Meaning even after saving the data the user is still prompted to confirm
 * dataloss.
 * Therefore you have to reset the form manually on successful submission.
 * Check the second parameter of Formiks `onSubmit` callback.
 */
export function ConfirmLeaveDirtyFormEffect() {
  const formik = useFormikContext();
  useConfirmUnloadEffect(formik.dirty);
  useConfirmNavigationEffect(formik.dirty);
  return null;
}

/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { MutationBundle } from "@eshg/lib-portal/types/query";
import { useFormikContext } from "formik";

import { useConfirmNavigationEffect } from "@/lib/shared/hooks/useConfirmNavigationEffect";
import { useConfirmUnloadEffect } from "@/lib/shared/hooks/useConfirmUnloadEffect";

interface ConfirmLeaveDirtyFormEffectProps {
  onSaveMutation?: MutationBundle;
}

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
  useConfirmUnloadEffect(formik.dirty);
  useConfirmNavigationEffect(formik.dirty, props.onSaveMutation);
  return null;
}

/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikErrors, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { isDeepEqual } from "remeda";

export function ErrorListener<T>({
  onError,
}: {
  onError: (errors: FormikErrors<T>) => void;
}) {
  const formik = useFormikContext();
  const [prevErrors, setPrevErrors] = useState<FormikErrors<T>>({});
  const [prevSubmitCount, setPrevSubmitCount] = useState<number>(0);

  useEffect(() => {
    if (
      Object.keys(formik.errors).length > 0 &&
      !isDeepEqual(formik.errors, prevErrors) &&
      formik.submitCount > prevSubmitCount
    ) {
      onError(formik.errors);
      setPrevErrors(formik.errors);
      setPrevSubmitCount(formik.submitCount);
    }
  }, [
    formik.errors,
    formik.submitCount,
    onError,
    prevErrors,
    setPrevErrors,
    prevSubmitCount,
    setPrevSubmitCount,
  ]);

  return null;
}

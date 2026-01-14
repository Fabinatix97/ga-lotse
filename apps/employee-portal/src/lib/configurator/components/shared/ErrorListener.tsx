/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikErrors, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { isDeepEqual } from "remeda";

export function ErrorListener<T>({
  onError,
  noErrors,
}: {
  onError: (errors: FormikErrors<T>) => void;
  noErrors: () => void;
}) {
  const formik = useFormikContext();
  const [prevErrors, setPrevErrors] = useState<FormikErrors<T>>({});
  const [prevSubmitCount, setPrevSubmitCount] = useState<number>(0);

  useEffect(() => {
    if (!isDeepEqual(formik.errors, prevErrors)) {
      if (
        Object.keys(formik.errors).length > 0 &&
        formik.submitCount > prevSubmitCount
      ) {
        onError(formik.errors);
        setPrevErrors(formik.errors);
        setPrevSubmitCount(formik.submitCount);
      }

      if (Object.keys(formik.errors).length === 0) {
        noErrors();
        setPrevErrors(formik.errors);
      }
    }
  }, [
    formik.errors,
    formik.submitCount,
    onError,
    noErrors,
    prevErrors,
    setPrevErrors,
    prevSubmitCount,
    setPrevSubmitCount,
  ]);

  return null;
}

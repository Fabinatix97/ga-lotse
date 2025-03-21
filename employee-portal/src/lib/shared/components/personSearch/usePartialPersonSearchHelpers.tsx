/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import { useCallback, useState } from "react";

import { PersonSearchFormValues } from "@/lib/shared/components/personSearch/PersonSearchForm";

export function usePartialPersonSearchHelpers() {
  const [alertMessage, setAlertMessage] = useState<string | undefined>();

  function renderAlert() {
    return (
      isNonEmptyString(alertMessage) && (
        <Alert color="primary" message={alertMessage} />
      )
    );
  }

  const hasAtLeastOneValue = useCallback((values: PersonSearchFormValues) => {
    return !!(values.firstName || values.lastName || values.dateOfBirth);
  }, []);

  const hasOnlyFirstNameFilled = useCallback(
    (values: PersonSearchFormValues) => {
      return !!(values.firstName && !values.lastName && !values.dateOfBirth);
    },
    [],
  );

  const hasOnlyLastNameFilled = useCallback(
    (values: PersonSearchFormValues) => {
      return !!(!values.firstName && values.lastName && !values.dateOfBirth);
    },
    [],
  );

  const isInvalidPartialSearch = useCallback(
    (values: PersonSearchFormValues) => {
      return hasOnlyFirstNameFilled(values) || hasOnlyLastNameFilled(values);
    },
    [hasOnlyFirstNameFilled, hasOnlyLastNameFilled],
  );

  const isFullSearch = useCallback((values: PersonSearchFormValues) => {
    return !!(values.firstName && values.lastName && values.dateOfBirth);
  }, []);

  return {
    hasAtLeastOneValue,
    isInvalidPartialSearch,
    hasOnlyFirstNameFilled,
    hasOnlyLastNameFilled,
    isFullSearch,
    setAlertMessage,
    renderAlert,
  };
}

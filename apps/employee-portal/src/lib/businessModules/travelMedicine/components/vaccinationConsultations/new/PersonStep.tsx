/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useRef } from "react";

import {
  DefaultSearchPersonForm,
  PersonSidebar,
} from "@eshg/lib-employee-portal";

import { FieldProps } from "./useAddNewProcedureSidebar";

export function PersonStep({
  formRef,
  onClose,
  handleNext,
  currentState,
  title,
}: FieldProps) {
  const closeableRef = useRef(true);

  const searchProps = currentState.searchInputs
    ? {
        searchFormComponent: DefaultSearchPersonForm,
        initialSearchState: currentState.searchInputs,
      }
    : {};

  return (
    <PersonSidebar
      title={title}
      formRef={formRef}
      submitLabel="Weiter"
      canChooseAddressType={false}
      {...searchProps}
      onClose={() => {
        if (!closeableRef.current) {
          return;
        }
        onClose();
      }}
      onSelect={async (values) => {
        closeableRef.current = false;
        await handleNext({ ...currentState, ...values });
      }}
      onCreate={async (values) => {
        closeableRef.current = false;
        await handleNext({ ...currentState, ...values });
      }}
    />
  );
}

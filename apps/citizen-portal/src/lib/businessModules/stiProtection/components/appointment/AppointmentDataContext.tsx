/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

type NotNull<T> = Exclude<T, null | undefined>;
type FormDataValue<T> = [NotNull<T>, (v: Partial<NotNull<T>>) => void];

const FormDataContext = createContext<FormDataValue<unknown> | null>(null);

interface FormDataProps<T> {
  initialData: T;
}

export function FormDataProvider<T>({
  initialData,
  children,
}: PropsWithChildren<FormDataProps<T>>) {
  const [data, setData] = useState(initialData);

  const contextValue = useMemo(
    () => [data, (newData: T) => setData((old) => ({ ...old, ...newData }))],
    [data, setData],
  );
  return (
    <FormDataContext value={contextValue as FormDataValue<unknown>}>
      {children}
    </FormDataContext>
  );
}
export function useFormData<T>() {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error("useFormData must be used with a FormDataProvider");
  }
  return context as FormDataValue<T>;
}

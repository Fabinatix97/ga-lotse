/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SnackbarValues } from "./SnackbarProvider";

export function addSnackbarToQueue({
  queue,
  newSnackbar,
}: {
  queue: SnackbarValues[];
  newSnackbar: SnackbarValues;
}): SnackbarValues[] {
  const index = queue.findIndex((snackbar) => snackbar.key === newSnackbar.key);
  if (index >= 0) {
    // replace element at index in array, return new array instance
    return queue.map((s, i) => (i === index ? newSnackbar : s));
  } else {
    // append new element add end of queue
    return [...queue, newSnackbar];
  }
}

export function removeSnackbarFromQueue({
  queue,
  key,
}: {
  queue: SnackbarValues[];
  key: string;
}): SnackbarValues[] {
  return queue.filter((snackbar) => snackbar.key !== key);
}

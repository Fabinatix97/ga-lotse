/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useNavigation } from "@eshg/lib-portal/components/navigation/NavigationContext";
import { MutationBundle } from "@eshg/lib-portal/types/query";
import { useEffect } from "react";

export function useConfirmNavigationEffect(
  triggerLeaveConfirmation: boolean,
  onSaveMutation?: MutationBundle,
): void {
  const { setCanNavigate, setOnSaveMutation } = useNavigation();
  useEffect(() => {
    setOnSaveMutation(onSaveMutation);
    setCanNavigate(!triggerLeaveConfirmation);
    return () => {
      setOnSaveMutation(undefined);
      setCanNavigate(true);
    };
  }, [
    triggerLeaveConfirmation,
    setCanNavigate,
    setOnSaveMutation,
    onSaveMutation,
  ]);
}

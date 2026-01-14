/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";

import { OnBeforeNavigateProps, useNavigation } from "@eshg/lib-portal";

export function useConfirmNavigationEffect(
  triggerLeaveConfirmation: boolean,
  onBeforeNavigateProps?: OnBeforeNavigateProps,
): void {
  const { setCanNavigate, setOnBeforeNavigateProps } = useNavigation();
  useEffect(() => {
    setOnBeforeNavigateProps(onBeforeNavigateProps);
    setCanNavigate(!triggerLeaveConfirmation);
    return () => {
      setOnBeforeNavigateProps(undefined);
      setCanNavigate(true);
    };
  }, [
    triggerLeaveConfirmation,
    setCanNavigate,
    setOnBeforeNavigateProps,
    onBeforeNavigateProps,
  ]);
}

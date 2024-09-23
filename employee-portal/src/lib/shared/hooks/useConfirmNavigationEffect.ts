/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useNavigation } from "@eshg/lib-portal/components/navigation/NavigationContext";
import { useEffect } from "react";

export function useConfirmNavigationEffect(
  triggerLeaveConfirmation: boolean,
): void {
  const { setCanNavigate } = useNavigation();
  useEffect(() => {
    setCanNavigate(!triggerLeaveConfirmation);
  }, [triggerLeaveConfirmation, setCanNavigate]);
}

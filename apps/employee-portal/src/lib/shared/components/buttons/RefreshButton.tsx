/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Cached } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { RefetchQueryFilters, useQueryClient } from "@tanstack/react-query";

interface RefreshButtonProps {
  queryKey: RefetchQueryFilters["queryKey"];
  loading: boolean;
  autoFocus?: boolean;
}

export function RefreshButton({
  queryKey,
  loading,
  autoFocus,
}: RefreshButtonProps) {
  const queryClient = useQueryClient();

  async function refresh() {
    await queryClient.refetchQueries({
      queryKey,
    });
  }

  return (
    <Button
      autoFocus={autoFocus}
      startDecorator={<Cached />}
      variant="outlined"
      loading={loading}
      loadingPosition="start"
      onClick={refresh}
    >
      Aktualisieren
    </Button>
  );
}

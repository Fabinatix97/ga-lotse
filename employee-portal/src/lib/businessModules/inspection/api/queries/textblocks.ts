/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { GetTextBlocksRequest } from "@eshg/inspection-api";

import { useTextBlockApi } from "@/lib/businessModules/inspection/api/clients";
import { textBlockApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";

function textBlockGettersQueryKey(request: GetTextBlocksRequest) {
  return textBlockApiQueryKey(["textBlockGetters", request]);
}

function getTextBlocksQueryKey(request: GetTextBlocksRequest) {
  return textBlockApiQueryKey([
    textBlockGettersQueryKey(request),
    "getTextBlocks",
  ]);
}

export function useGetTextBlocks(request: GetTextBlocksRequest) {
  const textBlockApi = useTextBlockApi();
  return useSuspenseQuery({
    queryKey: getTextBlocksQueryKey(request),
    queryFn: () =>
      textBlockApi.getTextBlocksRaw(request).then((res) => res.value()),
  });
}

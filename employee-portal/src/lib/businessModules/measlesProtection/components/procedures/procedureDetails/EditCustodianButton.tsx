/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiCustodian } from "@eshg/measles-protection-api";

import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

import { DropMenu } from "./DropMenu";

export function EditCustodianButton({
  index,
  custodian,
}: {
  index: number;
  custodian: ApiCustodian;
}) {
  const [_, setEditIndex] = useSearchParam("edit-custodian", "number");
  function onClick() {
    setEditIndex(index);
  }

  return <DropMenu onEdit={onClick} data={custodian} />;
}

/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { AuditHistory } from "@/lib/components/view/audit-log/AuditHistory";
import { Revision } from "@/lib/components/view/audit-log/AuditLog";

export function FilteredAuditHistory({
  revisions,
}: Readonly<{
  revisions: Revision[];
}>) {
  const searchParams = useSearchParams();
  const idFilter = searchParams.get("id");
  const committerFilter = searchParams.get("committer");
  const ipFilter = searchParams.get("ip");
  const filteredRevisions = useMemo(() => {
    return revisions.filter(
      (revision) =>
        (!idFilter || revision.id === idFilter) &&
        (!committerFilter || revision.committer === committerFilter) &&
        (!ipFilter || revision.ip === ipFilter),
    );
  }, [revisions, idFilter, committerFilter, ipFilter]);

  return <AuditHistory revisions={filteredRevisions} />;
}

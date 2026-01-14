/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { UseQueryResult } from "@tanstack/react-query";
import { ReactNode } from "react";

import { Error } from "@/lib/components/error/Error";
import { ContentHeader } from "@/lib/components/layout/page/header/ContentHeader";
import { CenteredCircularProgress } from "@/lib/components/progress/CenteredCircularProgress";

export function PageContent<RData>({
  title,
  query,
  renderContent,
}: Readonly<{
  title: string;
  query: UseQueryResult<RData, Error>;
  renderContent: (data: RData) => ReactNode;
}>) {
  return (
    <>
      <ContentHeader title={title} />
      <QueryDependentContent query={query} renderContent={renderContent} />
    </>
  );
}

export function QueryDependentContent<RData>({
  query,
  renderContent,
}: Readonly<{
  query: UseQueryResult<RData, Error>;
  renderContent: (data: RData) => ReactNode;
}>) {
  const { isPending, isError, error, data } = query;

  if (isPending) {
    return <CenteredCircularProgress />;
  }

  if (isError) {
    return <Error error={error} />;
  }

  return <>{renderContent(data)}</>;
}

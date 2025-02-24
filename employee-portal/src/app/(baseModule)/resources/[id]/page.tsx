/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";
import { endOfMonth, startOfMonth } from "date-fns";
import { startTransition, useState } from "react";

import { useGetResourceDetailsQuery } from "@/lib/baseModule/api/queries/resources";
import { ResourceDetail } from "@/lib/baseModule/components/resources/ResourceDetail";
import { routes } from "@/lib/baseModule/shared/routes";

export default function ResourceDetailsPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  const timeRangeStart = startOfMonth(currentCalendarDate);
  const timeRangeEnd = endOfMonth(currentCalendarDate);

  const query = useGetResourceDetailsQuery({
    id: params.id,
    timeRangeStart,
    timeRangeEnd,
  });

  const { resource, labels, calendarId, calendarEvents, eventsOfToday } =
    query.data;

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar title={resource.name} backHref={routes.resources.index} />
      }
    >
      <MainContentLayout>
        <ResourceDetail
          resource={resource}
          labels={labels.elements}
          calendarId={calendarId}
          resourceCalendarEvents={calendarEvents}
          timeRangeProps={{
            timeRangeStart,
            timeRangeEnd,
            setCurrentCalendarDate(value) {
              startTransition(() => {
                setCurrentCalendarDate(value);
              });
            },
          }}
          isTodayAvailable={eventsOfToday.length === 0}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}

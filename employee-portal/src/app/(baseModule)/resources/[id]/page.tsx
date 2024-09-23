/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { endOfMonth, startOfMonth } from "date-fns";
import { startTransition, useState } from "react";

import { useGetResourceDetailsQuery } from "@/lib/baseModule/api/queries/resources";
import { ResourceDetail } from "@/lib/baseModule/components/resources/ResourceDetail";
import { routes } from "@/lib/baseModule/shared/routes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

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
          isTodayAvaliable={eventsOfToday.length === 0}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}

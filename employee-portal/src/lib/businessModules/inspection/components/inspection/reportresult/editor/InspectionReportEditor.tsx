/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiEditorBodyElementsInner } from "@eshg/inspection-api";
import { BottomToolbar } from "@eshg/lib-employee-portal/components/toolbar/BottomToolbar";
import { useSuspenseQueries } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

import {
  useConfiguration,
  useEditorApi,
  useTextBlockApi,
} from "@/lib/businessModules/inspection/api/clients";
import {
  getTextBlocksQuery,
  loadEditorQuery,
} from "@/lib/businessModules/inspection/api/queries/inspectionReport";
import { ReportDownloadButtons } from "@/lib/businessModules/inspection/components/inspection/reportresult/ReportDownloadButtons";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { ContentEditor } from "@/lib/shared/components/contentEditor/ContentEditor";
import {
  PaletteItem,
  PaletteItemType,
} from "@/lib/shared/components/contentEditor/types";
import { StickyBottomBox } from "@/lib/shared/components/layout/StickyBottomBox";

export function InspectionReportEditor({
  reportId,
  inspectionId,
}: Readonly<{
  reportId: string;
  inspectionId: string;
}>) {
  const editorApi = useEditorApi();
  const textBlockApi = useTextBlockApi();

  const [{ data: editorData }, { data: textBlocks }] = useSuspenseQueries({
    queries: [
      loadEditorQuery(editorApi, reportId, inspectionId),
      getTextBlocksQuery(textBlockApi),
    ],
  });

  const { basePath } = useConfiguration();

  const palette: PaletteItem[] = textBlocks.map((textBlock) => {
    return {
      type: PaletteItemType.TEXT,
      name: textBlock.name,
      text: textBlock.content,
    };
  });

  function onAddItem(item: PaletteItem) {
    // Right now we only support adding TEXT elements (i.e. textBlocks), and we
    // assume that the provided PaletteItem is of type TEXT. This is guaranteed,
    // see above.
    const editorElement: ApiEditorBodyElementsInner = {
      id: uuidv4(), // temp id, will be replaced by server
      type: "TEXT",
      text: item.text,
      deletable: true,
      editable: true,
      moveable: true,
      highlighted: false,
    };
    return editorElement;
  }

  return (
    <>
      <ContentEditor
        editorData={editorData}
        palette={palette}
        editorApi={editorApi}
        onAddItem={onAddItem}
        imagesBasePath={`${basePath}/checklists/file/`}
      />
      <StickyBottomBox>
        <BottomToolbar>
          <ButtonBar left={<ReportDownloadButtons reportId={reportId} />} />
        </BottomToolbar>
      </StickyBottomBox>
    </>
  );
}

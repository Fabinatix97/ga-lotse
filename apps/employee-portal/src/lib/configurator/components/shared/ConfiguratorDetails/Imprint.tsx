/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useUpdateImprintMarkdown } from "@/lib/configurator/api/mutations/useUpdateImprint";
import { useGetImprintMarkdown } from "@/lib/configurator/api/queries/imprint";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";

import { MarkdownFiles } from "./MarkdownFiles";

export function Imprint(props: { module: ConfiguratorModuleName }) {
  const { data: markdownFiles } = useGetImprintMarkdown();
  const updateImprintMarkdown = useUpdateImprintMarkdown();

  return (
    <MarkdownFiles
      portalType="CITIZEN"
      module={props.module}
      endpointName="IMPRINT_MARKDOWNS_CONFIG"
      fileName="IMPRINT"
      markdownFiles={markdownFiles}
      updateMarkdown={updateImprintMarkdown}
    />
  );
}

/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useUpdateImprintMarkdown } from "@/lib/shared/api/mutations/configurator/useUpdateImprint";
import { useGetImprintMarkdown } from "@/lib/shared/api/queries/configurator/imprint";

import { MarkdownFiles } from "./MarkdownFiles";

export function Imprint(props: { module: ConfiguratorModuleName }) {
  const { data: markdownFiles } = useGetImprintMarkdown();
  const updateImprintMarkdown = useUpdateImprintMarkdown();

  return (
    <MarkdownFiles
      mode="single"
      module={props.module}
      endpointName="IMPRINT_MARKDOWNS_CONFIG"
      fileName="IMPRINT"
      markdownFiles={markdownFiles}
      updateMarkdown={updateImprintMarkdown}
    />
  );
}

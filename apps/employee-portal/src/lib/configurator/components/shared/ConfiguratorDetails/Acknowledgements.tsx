/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useUpdateAcknowledgementsMarkdown } from "@/lib/shared/api/mutations/configurator/useUpdateAcknowledgements";
import { useGetAcknowledgementsMarkdown } from "@/lib/shared/api/queries/configurator/acknowledgements";

import { MarkdownFiles } from "./MarkdownFiles";

export function Acknowledgements(props: { module: ConfiguratorModuleName }) {
  const { data: acknowledgementsMarkdownFiles } =
    useGetAcknowledgementsMarkdown();
  const updateAcknowledgementsMarkdown = useUpdateAcknowledgementsMarkdown();

  return (
    <MarkdownFiles
      portalType="EMPLOYEE"
      module={props.module}
      fileName="ACKNOWLEDGEMENTS"
      endpointName="ACKNOWLEDGEMENTS_MARKDOWNS_CONFIG"
      markdownFiles={acknowledgementsMarkdownFiles}
      updateMarkdown={updateAcknowledgementsMarkdown}
    />
  );
}

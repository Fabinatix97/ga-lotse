/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useUpdateContactMarkdown } from "@/lib/shared/api/mutations/configurator/useUpdateContact";
import { useGetContactMarkdown } from "@/lib/shared/api/queries/configurator/contact";

import { MarkdownFiles } from "./MarkdownFiles";

export function Contact(props: { module: ConfiguratorModuleName }) {
  const { data: contactMarkdownFiles } = useGetContactMarkdown();
  const updateContactMarkdown = useUpdateContactMarkdown();

  return (
    <MarkdownFiles
      portalType="EMPLOYEE"
      module={props.module}
      fileName="CONTACT"
      endpointName="CONTACT_MARKDOWNS_CONFIG"
      markdownFiles={contactMarkdownFiles}
      updateMarkdown={updateContactMarkdown}
    />
  );
}

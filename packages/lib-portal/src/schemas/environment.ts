/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { picklist, pipe, string, url } from "valibot";

export const NodeEnvSchema = picklist(["development", "production"]);

export const EnvironmentTypeSchema = picklist(["local", "dev", "production"]);

export const DeploymentTypeSchema = picklist(["test", "production"]);

export const UrlSchema = pipe(string(), url());

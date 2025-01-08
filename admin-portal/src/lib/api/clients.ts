/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Configuration,
  ConfigurationParameters,
  HTTPHeaders,
  Middleware,
  ServiceDirectoryAdminApi,
} from "@eshg/admin-portal-api/serviceDirectory";

import { setAdminName } from "@/lib/helpers/adminName";

export interface BackendError {
  status: number;
  message: string;
}

let lastMockClientCert: string | undefined;

function useConfig(): Configuration {
  const basePath = window.location.origin;
  const headers: HTTPHeaders = {};
  if (!basePath.startsWith("https")) {
    setMockClientCert(headers);
  }
  return new Configuration({
    basePath,
    headers,
    middleware: [errorInterceptionMiddleware, adminNameInterceptorMiddleware],
  } satisfies ConfigurationParameters);
}

function setMockClientCert(headers: HTTPHeaders) {
  let mockClientCert =
    "-----BEGIN CERTIFICATE-----MIIFBzCCAu+gAwIBAgIUPNKZFZTC06rUrd4mazoV3i0w/fcwDQYJKoZIhvcNAQELBQAwEzERMA8GA1UEAwwIZnJvbnRlbmQwHhcNMjQwNzE3MTAyMTA1WhcNMzQwNzE1MTAyMTA1WjATMREwDwYDVQQDDAhmcm9udGVuZDCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAMLQdv4/PLXhWkESHUpOGgEedevS/MUHahkygBkRu8b98K01jKtPbGsk66CviLtMj1stay1cEkQhBUiD7aWxG3E9SfyW3i0LkNcvy04OH2fLvVPe5OoXzFD+ENmiI4MzfiR8xawA80yKc/MzlXXqDDB2Ebb/I8a9d4HZjeCNdxq1lOq4rxR5aUKi34FQWnRNUPaWgmx7B3DESBo0bRa1InsWsVkDvKpRXyc5Be9cSpN52gdFWVsIbppcJ1gWHuBZlHnNwvrFkgL3UCK2SaZBDhb3inW+RhTFWxJaEPBfyzrb8PvW4K487SUUnzw93QUFAuP+i3gjmsJFNKYCffo9SGksLD4PS8cxrDLprZoYuiBiT3jtdEOkRZKGY2pIRvSGNcOqbi0bJrZM8tyWV8BTlw/yQFjfDlSMA5CzdVkNYdnT+mCO4WPo4jADT+0brNrxDYQi+Poey/P4wbARXXNFn9HZcNHXwVTi+pWDTje/UdiQlfo7LBU9TQ6pHliJ/JgVPp4Z6oMC1vQICizLnQGsz4LR23BkT40SwkOsYqxT6NgQwHGlmIrFEHP4A6H+x2gqQNJRDlGwsMU/dsujEWtQqYpSqngInMNaNdudU9CzhJOJ9qzLuBpY8qBZmIuVmA/DR9A0BfsndUBxm2e2MM/CpoO0qG1jskiZSAym8oRYen1rAgMBAAGjUzBRMB0GA1UdDgQWBBR2Wy73zYs9y54VSNMosErpKBxW9zAfBgNVHSMEGDAWgBR2Wy73zYs9y54VSNMosErpKBxW9zAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4ICAQCZjJUFdDmVPmrrUrDt/+7ofYOAPwlaOWIY1RXyquPl2Pg9NUwTi03aCwq3fMpgaTv9z52M+T0Yq1zniOtfcpV8bdndx7o0PdjlmwRPqUXc0PezKIGPDgWYK8gzKr4R8p/hNDQPT+zwkgu/yraDlN3yhZfaTTwwijt82mAzz3bG1NfPcb8lemefRF+Z1B11pkC4WT3aUoHQY+Kr21mpU2qFGdv8sSURBOqLzr0JgG1YneEysQ53Hbe7KFPd2AtPZCny1CK9pmt7vaAOcE3b3Z7jX3Pel3d2YwO5cD/MeByqCJb7VYUyq4u9tdftdxMpFLv/bxtxbkxRCvnFVAKHrl6GrCYkzKi45+JdYQpfaSfxWjoj4yKdVpydXznnqiT/scp7ftY3uOHKdPRSDQgKbEK5Gp1cEZTxSNNkdMVnVmuI7hTsIF2WvELPyHLGW51FZishYYN3sob1PfaGDhClVRDhvLgrVjEy8FyhTT5TNcb8JRNAIaNYmlDGWD/hkVWhpYnODyaPoX/TddQG+YdvvfxTP/ZonxaHmR8XTV2OBSPNG6ioqX+CD8u+hO2YoHsQwoauTWUQ1SV2prl89/H6dF9QOd/7YhddLdwHdnqs0S9Zy4fpXGw2jr3Ay5ausoTv6+/BjhzIqUh1WX1Km0dYvf9yL6zD4oPHYh4DdLq/AyEwPg==-----END CERTIFICATE-----";
  if (typeof window !== "undefined") {
    const configuredMockClientCert =
      window.localStorage.getItem("mock-client-cert");
    if (configuredMockClientCert) {
      mockClientCert = configuredMockClientCert;
    }
  }
  if (lastMockClientCert !== mockClientCert) {
    lastMockClientCert = mockClientCert;
    // eslint-disable-next-line no-console
    console.warn("Using mock-client-cert:", mockClientCert);
  }
  headers["X-ESHG-CLIENT-CERT"] = mockClientCert;
}

export function useAdminApi(): ServiceDirectoryAdminApi {
  const config = useConfig();
  return new ServiceDirectoryAdminApi(config);
}

const errorInterceptionMiddleware: Middleware = {
  async post(context) {
    if (!context.response.ok) {
      throw await resolveErrorResponse(context.response);
    }
  },
  async onError(context) {
    if (context.response === undefined) {
      const cause = resolveCause(context.error);
      throw new Error(`Failed to fetch ${context.url}${cause}`);
    }
    return Promise.resolve();
  },
};

export async function resolveErrorResponse(
  response: Response,
): Promise<BackendError> {
  try {
    const message = await response.text();
    return {
      status: response.status,
      message,
    };
  } catch {
    return {
      status: response.status,
      message: `Response returned error code ${response.status} for ${response.url}`,
    };
  }
}

const adminNameInterceptorMiddleware: Middleware = {
  async post(context) {
    const adminName = context.response.headers.get("x-eshg-admin-name");
    setAdminName(adminName);
    return Promise.resolve(context.response);
  },
};

function resolveCause(error: unknown) {
  return error instanceof Error && error.cause instanceof Error
    ? ` (${error.cause.message})`
    : "";
}

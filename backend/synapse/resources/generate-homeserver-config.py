# Copyright 2024 cronn GmbH
# SPDX-License-Identifier: Apache-2.0

from jwcrypto import jwk
from string import Template
import requests
import sys
import os

def download_jwks(jwks_url, alg):
  print(f"Downloading keycloak {alg} JWKS from {jwks_url}")
  try:
    keycloak_jwks_list = requests.get(jwks_url).json()
    jwks = [key for key in keycloak_jwks_list['keys'] if key['alg'] == alg][0]
    return jwks
  except Exception as e:
    print(f"An error occurred: {e}")
    sys.exit(1)


def jwks_to_pem(jwks_params):
  print(f"Converting JWKS to PEM format...")
  try:
    jwks = {
      "kid": jwks_params["kid"],
      "kty": jwks_params['kty'],
      "alg": jwks_params['alg'],
      "use": jwks_params['use'],
      "n": jwks_params['n'],
      "e": jwks_params['e']
    }
    key = jwk.JWK(**jwks)
    pem = key.export_to_pem()
    return pem
  except Exception as e:
    print(f"An error occurred: {e}")
    sys.exit(1)


def generate_homeserver_config(template_filepath, output_filepath, env_vars):
  print(f"Generating {output_filepath}")
  try:
    homeserver_config = ""
    with open(template_filepath, 'r') as file:
      homeserver_config = file.read()
    template = Template(homeserver_config)
    homeserver_config = template.substitute(env_vars)

    output_dir = os.path.dirname(output_filepath)
    if output_dir and not os.path.exists(output_dir):
      os.makedirs(output_dir)

    with open(output_filepath, 'w') as file:
      file.write(homeserver_config)
  except Exception as e:
    print(f"An error occurred: {e}")
    sys.exit(1)


print(f"\nGenerating homeserver config...")

homeserver_template_filepath = "/data/homeserver.template"
homeserver_filepath = "/data/homeserver.yaml"
keycloak_jwks_url = os.getenv("KEYCLOAK_JWKS_URL")

env_vars = dict(os.environ)
env_vars["KEYCLOAK_RS256_PEM"] = jwks_to_pem(download_jwks(keycloak_jwks_url, "RS256"))

generate_homeserver_config(homeserver_template_filepath, homeserver_filepath, env_vars)

print(f"Finished generating homeserver config.\n\n")

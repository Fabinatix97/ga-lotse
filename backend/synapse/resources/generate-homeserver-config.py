# Copyright 2024 cronn GmbH
# SPDX-License-Identifier: Apache-2.0

from string import Template
import os

def generate_homeserver_config(template_filepath, output_filepath):
  print(f"Generating {output_filepath}")
  try:
    homeserver_config = ""
    with open(template_filepath, 'r') as file:
      homeserver_config = file.read()
    template = Template(homeserver_config)
    homeserver_config = template.substitute(**os.environ)

    output_dir = os.path.dirname(output_filepath)
    if output_dir and not os.path.exists(output_dir):
      os.makedirs(output_dir)

    with open(output_filepath, 'w') as file:
      file.write(homeserver_config)
  except Exception as e:
    print(f"An error occurred: {e}")


homeserver_template_filepath = "/data/homeserver.template"
homeserver_filepath = "/data/homeserver.yaml"

generate_homeserver_config(homeserver_template_filepath, homeserver_filepath)

print(f"Finished generating homeserver config.")

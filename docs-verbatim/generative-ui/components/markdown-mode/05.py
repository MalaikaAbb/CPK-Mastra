ui = input.forwarded_props["copilotkit"]["ui"]
catalog = ui["1.0"]["inlineCatalogs"][0]
system = f"{MY_PROMPT}\n\n{catalog['instructions']}\n\nComponents:\n{json.dumps(catalog['components'])}"

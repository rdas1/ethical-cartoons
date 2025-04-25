import json
import os
import sys

# Make sure app is importable
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db import SessionLocal
from app.models import Module, Scenario, DecisionOption

def load_seed_data(json_path):
    with open(json_path, 'r') as f:
        return json.load(f)

def seed_module(session, data):
    # Check if module already exists
    module = session.query(Module).filter_by(name=data['module_name']).first()
    if not module:
        module = Module(name=data['module_name'])
        session.add(module)
        session.commit()
        print(f"✅ Created module '{module.name}'")
    else:
        print(f"⚡ Module '{module.name}' already exists. Adding scenarios to it.")

    for scenario_data in data['scenarios']:
        existing = session.query(Scenario).filter_by(name=scenario_data['name']).first()
        if existing:
            print(f"⚠️  Scenario '{scenario_data['name']}' already exists. Skipping.")
            continue

        scenario = Scenario(name=scenario_data['name'], module=module)
        session.add(scenario)
        session.flush()  # Get ID

        for opt in scenario_data.get('options', []):
            option = DecisionOption(
                label=opt['label'],
                description=opt.get('description', ''),
                scenario=scenario
            )
            session.add(option)

        print(f"✅ Added scenario '{scenario.name}' with {len(scenario_data.get('options', []))} options.")

    session.commit()
    print("🎉 Done seeding!")

def main():
    import argparse

    parser = argparse.ArgumentParser(description="Seed database from a JSON file.")
    parser.add_argument("json_path", type=str, help="Path to JSON file")
    args = parser.parse_args()

    session = SessionLocal()

    try:
        data = load_seed_data(args.json_path)
        seed_module(session, data)
    finally:
        session.close()

if __name__ == "__main__":
    main()

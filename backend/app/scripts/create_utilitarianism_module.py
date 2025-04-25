from app.db.db import SessionLocal
from app.models.models import Module, Scenario, DecisionOption, DiscussionThread
from sqlalchemy.exc import IntegrityError

db = SessionLocal()

def create_module_if_not_exists(name):
    module = db.query(Module).filter_by(name=name).first()
    if not module:
        module = Module(name=name)
        db.add(module)
        db.commit()
        db.refresh(module)
    return module

def create_scenario(module, name, scenario_type, options, question_text=None, post_response_text=None):
    scenario = db.query(Scenario).filter_by(name=name).first()
    if scenario:
        print(f"Scenario {name} already exists, skipping.")
        return scenario

    scenario = Scenario(
        name=name,
        module_id=module.id,
        scenario_type=scenario_type,
        question_text=question_text,
        post_response_text=post_response_text,
    )
    db.add(scenario)
    db.flush()

    for opt in options:
        db.add(DecisionOption(
            scenario_id=scenario.id,
            label=opt["label"],
            description=opt.get("description", None)
        ))
    
    db.commit()
    db.refresh(scenario)
    print(f"Created scenario {name}")
    return scenario

def create_discussion_thread_if_not_exists(slug, title=None):
    thread = db.query(DiscussionThread).filter_by(slug=slug).first()
    if not thread:
        thread = DiscussionThread(slug=slug, title=title)
        db.add(thread)
        db.commit()
        db.refresh(thread)
        print(f"Created discussion thread '{slug}'")
    else:
        print(f"Discussion thread '{slug}' already exists, skipping.")
    return thread


def main():
    util_module = create_module_if_not_exists("Utilitarianism")

    create_scenario(
        util_module,
        "utilitarianism-intro-trolley-classic",
        scenario_type="trolley",
        options=[
            {"label": "pullTheLever", "description": "Divert the trolley to save 5 people."},
            {"label": "doNothing", "description": "Let the trolley continue on its current course toward 5 people."}
        ],
        question_text="What would you do in order to maximize overall happiness?"
    )

    create_scenario(
        util_module,
        "utilitarianism-intro-trolley-cancer",
        scenario_type="trolley",
        options=[
            {"label": "pullTheLever", "description": "Divert the trolley and save the cancer-curing scientist."},
            {"label": "doNothing", "description": "Let the trolley continue toward the oil lobbyists."}
        ],
        question_text="What would you do in order to maximize overall happiness?"
    )

    create_scenario(
        util_module,
        "repugnant-conclusion",
        scenario_type="question",
        options=[
            {"label": "World A's population", "description": "1 billion people with moderate happiness."},
            {"label": "World B's population", "description": "40,000 people with very high happiness."}
        ],
        question_text="Which group is better off?"
    )

    create_scenario(
        util_module,
        "labor-conditions",
        scenario_type="question",
        options=[
            {"label": "Mass Production", "description": "Save more lives but exploit workers."},
            {"label": "Labor Conditions", "description": "Protect workers but save fewer lives."}
        ],
        question_text="Which production method is more ethical?"
    )

    # ✅ Create a DiscussionThread for repugnant-conclusion
    create_discussion_thread_if_not_exists("repugnant-conclusion", title="Discussion: Repugnant Conclusion")
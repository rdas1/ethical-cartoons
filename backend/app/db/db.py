from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.models.models import Base, Module, Scenario, DecisionOption, DiscussionThread, Comment, CommentReaction
from app.models.homework import HomeworkAssignment
from typing import Generator

engine = create_engine("sqlite:///responses.db")
SessionLocal = sessionmaker(bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    intro = db.query(Module).filter_by(name="IntroModule").first()
    if not intro:
        intro = Module(name="IntroModule")
        db.add(intro)
        db.commit()
        db.refresh(intro)

    default_options = {
        "trolley": ["pullTheLever", "doNothing"],
        "transplant": ["sacrifice", "spare"]
    }

    for scenario_name, options in default_options.items():
        scenario = db.query(Scenario).filter_by(name=scenario_name).first()
        if not scenario:
            scenario = Scenario(name=scenario_name, module=intro, scenario_type=scenario_name)
            db.add(scenario)
            db.commit()
            db.refresh(scenario)
        for label in options:
            existing = db.query(DecisionOption).filter_by(scenario_id=scenario.id, label=label).first()
            if not existing:
                db.add(DecisionOption(scenario=scenario, label=label))

    # Create discussion thread if it doesn't exist
    slug = "trolley-vs-transplant"
    existing_thread = db.query(DiscussionThread).filter_by(slug=slug).first()
    if not existing_thread:
        thread = DiscussionThread(slug=slug)
        db.add(thread)

    db.commit()

    db.close()

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


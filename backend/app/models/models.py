from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Module(Base):
    __tablename__ = "modules"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    scenarios = relationship("Scenario", back_populates="module")

class Scenario(Base):
    __tablename__ = "scenarios"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    module_id = Column(Integer, ForeignKey("modules.id"))
    module = relationship("Module", back_populates="scenarios")
    responses = relationship("Response", back_populates="scenario")
    options = relationship("DecisionOption", back_populates="scenario", cascade="all, delete-orphan")

class DecisionOption(Base):
    __tablename__ = "decision_options"
    id = Column(Integer, primary_key=True)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"), nullable=False)
    label = Column(String, nullable=False)
    description = Column(String, nullable=True)
    scenario = relationship("Scenario", back_populates="options")
    __table_args__ = (UniqueConstraint("scenario_id", "label", name="unique_option_per_scenario"),)

class Response(Base):
    __tablename__ = "responses"
    id = Column(Integer, primary_key=True)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"))
    option_id = Column(Integer, ForeignKey("decision_options.id"))
    session_id = Column(String, index=True)
    scenario = relationship("Scenario", back_populates="responses")
    option = relationship("DecisionOption")
    __table_args__ = (UniqueConstraint("scenario_id", "session_id", name="unique_response_per_session"),)

from crewai import Agent

# Scout Agent: collects trader data
scout = Agent(
    name="Scout",
    role="Data Collector",
    authority_level=1,  # RANK-1
    memory_layers=["short_term"],
    kill_switch=False
)

# Guardian Agent: applies risk rules
guardian = Agent(
    name="Guardian",
    role="Risk Reviewer",
    authority_level=2,  # RANK-2
    memory_layers=["short_term", "audit_logs"],
    kill_switch=True
)

# Officer Agent: human oversight
officer = Agent(
    name="Officer",
    role="Final Approver",
    authority_level=3,  # RANK-3
    memory_layers=["long_term", "audit_logs"],
    kill_switch=True
)

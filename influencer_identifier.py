"""Public Influencer Identifier — simple demo scaffold.

Scores a list of public accounts by a naive "influence" heuristic and
returns the most influential ones. This is placeholder code to get the
repository started.
"""

from dataclasses import dataclass


@dataclass
class Account:
    handle: str
    followers: int
    avg_engagement: float  # fraction, e.g. 0.05 == 5%


def influence_score(account: Account) -> float:
    """Naive influence score: reach weighted by engagement quality."""
    return account.followers * (1 + account.avg_engagement)


def top_influencers(accounts: list[Account], limit: int = 3) -> list[Account]:
    """Return the top `limit` accounts ranked by influence score."""
    return sorted(accounts, key=influence_score, reverse=True)[:limit]


if __name__ == "__main__":
    sample = [
        Account("@alice", followers=120_000, avg_engagement=0.03),
        Account("@bob", followers=15_000, avg_engagement=0.12),
        Account("@carol", followers=500_000, avg_engagement=0.01),
    ]

    print("Top influencers:")
    for rank, acct in enumerate(top_influencers(sample), start=1):
        print(f"  {rank}. {acct.handle} (score={influence_score(acct):,.0f})")

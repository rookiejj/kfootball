#!/usr/bin/env python3
"""
API-Football (api-sports.io) coverage probe for K League project.

Goal: verify whether a free-tier API key can deliver the data we need for
MVP — K1/K2/FA Cup fixtures & standings, K1 teams/squad, top scorers, and
overseas Korean players (Son Heung-min as representative).

Usage:
    export API_FOOTBALL_KEY=xxxxxxxx
    python3 scripts/probe_api_football.py

Free plan: 100 calls/day. This probe uses ~10 calls per run.
"""

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime

BASE = "https://v3.football.api-sports.io"
KEY = os.environ.get("API_FOOTBALL_KEY")

SEASONS_TO_TRY = [2026, 2025, 2024, 2023]


def get(path: str, params: dict) -> dict:
    qs = urllib.parse.urlencode(params)
    url = f"{BASE}{path}?{qs}"
    req = urllib.request.Request(url, headers={"x-apisports-key": KEY})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        print(f"  [HTTP {e.code}] {path} — {body[:200]}")
        return {"response": [], "errors": {"http": e.code}}


def line(msg: str = ""):
    print(msg)


def header(msg: str):
    line()
    line(f"=== {msg} ===")


def summarize_response(resp: dict, label: str) -> int:
    results = resp.get("results", 0)
    errors = resp.get("errors")
    if errors:
        line(f"  {label}: errors={errors}")
    line(f"  {label}: results={results}")
    return results


def main():
    if not KEY:
        print("ERROR: API_FOOTBALL_KEY env var not set.")
        print("Get a free key: https://dashboard.api-football.com/register")
        print("Then: export API_FOOTBALL_KEY=xxx && python3 scripts/probe_api_football.py")
        sys.exit(1)

    line(f"API-Football probe — {datetime.now().isoformat(timespec='seconds')}")
    line(f"Key: ...{KEY[-6:]}")

    # --- 1. Status / quota
    header("1. Account status & quota")
    status = get("/status", {})
    acc = status.get("response", {}).get("account", {})
    sub = status.get("response", {}).get("subscription", {})
    req_info = status.get("response", {}).get("requests", {})
    line(f"  plan: {sub.get('plan')}  end: {sub.get('end')}  active: {sub.get('active')}")
    line(f"  requests today: {req_info.get('current')}/{req_info.get('limit_day')}")

    # --- 2. Leagues in South Korea
    header("2. Leagues in South Korea")
    leagues = get("/leagues", {"country": "South-Korea"})
    summarize_response(leagues, "leagues")
    k1_id = k2_id = cup_id = None
    for item in leagues.get("response", []):
        lg = item.get("league", {})
        name, lid, ltype = lg.get("name"), lg.get("id"), lg.get("type")
        seasons = [s.get("year") for s in item.get("seasons", [])]
        line(f"  - [{lid}] {name} ({ltype}) seasons={min(seasons) if seasons else '?'}~{max(seasons) if seasons else '?'}")
        lname = (name or "").lower()
        if "k league 1" in lname or "k-league 1" in lname:
            k1_id = lid
        elif "k league 2" in lname or "k-league 2" in lname:
            k2_id = lid
        elif "korea cup" in lname or "korean fa cup" in lname:
            cup_id = lid
    line(f"  resolved: K1={k1_id} K2={k2_id} Cup={cup_id}")

    if not k1_id:
        print("FATAL: could not find K League 1. Country param may differ; try country=Korea-Republic.")
        sys.exit(2)

    # --- 3. Find a usable season for K1 (standings as proxy)
    header("3. K1 standings — find season available on this plan")
    usable_season = None
    for season in SEASONS_TO_TRY:
        resp = get("/standings", {"league": k1_id, "season": season})
        n = summarize_response(resp, f"season {season}")
        if n > 0:
            usable_season = season
            table = resp["response"][0]["league"]["standings"][0]
            line(f"  ✓ season {season} works — top 3:")
            for row in table[:3]:
                t = row["team"]["name"]
                pts = row["points"]
                p = row["all"]["played"]
                line(f"    {row['rank']}. {t} — {pts}pt ({p}경기)")
            break
    if not usable_season:
        print("FATAL: no K1 standings for any tested season on this plan.")
        sys.exit(3)

    # --- 4. K1 upcoming fixtures
    header(f"4. K1 upcoming fixtures (season {usable_season})")
    fx = get("/fixtures", {"league": k1_id, "season": usable_season, "next": 5})
    summarize_response(fx, "fixtures (next 5)")
    for f in fx.get("response", []):
        d = f["fixture"]["date"]
        h = f["teams"]["home"]["name"]
        a = f["teams"]["away"]["name"]
        venue = f["fixture"].get("venue", {}).get("name")
        line(f"  {d} | {h} vs {a} @ {venue}")

    # --- 5. K1 top scorers
    header(f"5. K1 top scorers (season {usable_season})")
    ts = get("/players/topscorers", {"league": k1_id, "season": usable_season})
    summarize_response(ts, "top scorers")
    for p in ts.get("response", [])[:5]:
        pl = p["player"]
        stats = p["statistics"][0]
        goals = stats["goals"]["total"]
        team = stats["team"]["name"]
        line(f"  {pl['name']} ({team}) — {goals}골")

    # --- 6. K2 sanity (1 call)
    if k2_id:
        header(f"6. K2 standings sanity (season {usable_season})")
        resp = get("/standings", {"league": k2_id, "season": usable_season})
        n = summarize_response(resp, f"K2 standings")
        if n > 0:
            table = resp["response"][0]["league"]["standings"][0]
            line(f"  ✓ K2 — top 1: {table[0]['team']['name']} {table[0]['points']}pt")

    # --- 7. Overseas Korean: Son Heung-min
    header("7. Overseas Korean player — Son Heung-min")
    sp = get("/players/profiles", {"search": "son heung"})
    n = summarize_response(sp, "profile search")
    for p in sp.get("response", [])[:3]:
        pl = p["player"]
        line(f"  [{pl['id']}] {pl['name']} — {pl.get('nationality')} — born {pl.get('birth', {}).get('date')}")

    line()
    line("Probe complete. Review output above — every section with results>0 is usable.")


if __name__ == "__main__":
    main()

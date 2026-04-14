#!/usr/bin/env python3
"""
Deep-dive probe: can we build the MVP with API-Football fixture data?

Verifies (for K League 1 2024, free-plan-compatible):
  - Full season fixtures count & date range
  - Per-fixture fields available (venue, referee, round, status, goals, etc.)
  - Lineups endpoint (starting XI, formation)
  - Events endpoint (goals, cards, subs)
  - Statistics endpoint (possession, shots, xG, etc.)

Usage:
    export API_FOOTBALL_KEY=xxx
    python3 scripts/probe_fixtures.py

Uses ~5 API calls.
"""

import json
import os
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter
from datetime import datetime

BASE = "https://v3.football.api-sports.io"
KEY = os.environ.get("API_FOOTBALL_KEY")
K1 = 292
SEASON = 2024


def get(path: str, params: dict) -> dict:
    qs = urllib.parse.urlencode(params)
    url = f"{BASE}{path}?{qs}"
    req = urllib.request.Request(url, headers={"x-apisports-key": KEY})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        print(f"  [HTTP {e.code}] {path} — {body[:200]}")
        return {"response": [], "errors": {"http": e.code}}


def section(msg: str):
    print()
    print(f"=== {msg} ===")


def main():
    if not KEY:
        print("ERROR: API_FOOTBALL_KEY not set. export API_FOOTBALL_KEY=xxx")
        sys.exit(1)

    print(f"Fixture probe — {datetime.now().isoformat(timespec='seconds')}")
    print(f"League: K1 (id={K1})  Season: {SEASON}")

    # 1. ALL fixtures for K1 2024
    section("1. All K1 2024 fixtures")
    resp = get("/fixtures", {"league": K1, "season": SEASON})
    fixtures = resp.get("response", [])
    print(f"  total results: {resp.get('results')}")
    if not fixtures:
        print("  no fixtures. check errors above.")
        sys.exit(2)

    dates = sorted(f["fixture"]["date"] for f in fixtures)
    statuses = Counter(f["fixture"]["status"]["short"] for f in fixtures)
    rounds = Counter(f["league"]["round"] for f in fixtures)
    venues = {f["fixture"]["venue"].get("name") for f in fixtures if f["fixture"].get("venue")}
    referees = {f["fixture"].get("referee") for f in fixtures if f["fixture"].get("referee")}

    print(f"  date range: {dates[0][:10]} ~ {dates[-1][:10]}")
    print(f"  statuses: {dict(statuses)}")
    print(f"  unique rounds: {len(rounds)}  (sample: {list(rounds.keys())[:3]})")
    print(f"  unique venues: {len(venues)}")
    print(f"  unique referees: {len(referees)}")

    # Sample fields from first fixture
    f0 = fixtures[0]
    print()
    print("  sample fixture fields:")
    print(f"    fixture.id: {f0['fixture']['id']}")
    print(f"    fixture.date: {f0['fixture']['date']}")
    print(f"    fixture.timestamp: {f0['fixture']['timestamp']}")
    print(f"    fixture.timezone: {f0['fixture']['timezone']}")
    print(f"    fixture.venue: {f0['fixture']['venue']}")
    print(f"    fixture.status: {f0['fixture']['status']}")
    print(f"    fixture.referee: {f0['fixture'].get('referee')}")
    print(f"    league.round: {f0['league']['round']}")
    print(f"    teams.home: id={f0['teams']['home']['id']} name={f0['teams']['home']['name']} logo={bool(f0['teams']['home'].get('logo'))}")
    print(f"    teams.away: id={f0['teams']['away']['id']} name={f0['teams']['away']['name']}")
    print(f"    goals: {f0['goals']}")
    print(f"    score: {f0['score']}")

    # Pick one finished fixture for detail probes
    finished = next((f for f in fixtures if f["fixture"]["status"]["short"] == "FT"), None)
    if not finished:
        print("  no finished fixture found for detail probes; exiting")
        return
    fid = finished["fixture"]["id"]
    home = finished["teams"]["home"]["name"]
    away = finished["teams"]["away"]["name"]
    print(f"\n  detail target: fixture {fid} — {home} vs {away}")

    # 2. Lineups
    section(f"2. Lineups (fixture {fid})")
    lu = get("/fixtures/lineups", {"fixture": fid})
    lu_resp = lu.get("response", [])
    print(f"  results: {len(lu_resp)}")
    for team_lu in lu_resp:
        team = team_lu["team"]["name"]
        form = team_lu.get("formation")
        start = len(team_lu.get("startXI", []))
        subs = len(team_lu.get("substitutes", []))
        coach = team_lu.get("coach", {}).get("name")
        print(f"  {team}: formation={form}  start={start}  subs={subs}  coach={coach}")
        if team_lu.get("startXI"):
            sample = team_lu["startXI"][0]["player"]
            print(f"    sample player: {sample}")

    # 3. Events
    section(f"3. Events (fixture {fid})")
    ev = get("/fixtures/events", {"fixture": fid})
    ev_resp = ev.get("response", [])
    print(f"  total events: {len(ev_resp)}")
    by_type = Counter(e["type"] for e in ev_resp)
    print(f"  by type: {dict(by_type)}")
    if ev_resp:
        print(f"  sample: {ev_resp[0]}")

    # 4. Statistics
    section(f"4. Statistics (fixture {fid})")
    st = get("/fixtures/statistics", {"fixture": fid})
    st_resp = st.get("response", [])
    print(f"  results (teams): {len(st_resp)}")
    if st_resp:
        team = st_resp[0]["team"]["name"]
        stat_keys = [s["type"] for s in st_resp[0].get("statistics", [])]
        print(f"  {team} stat types ({len(stat_keys)}): {stat_keys}")

    print()
    print("Probe complete.")


if __name__ == "__main__":
    main()

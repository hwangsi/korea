<!-- 유엔군 컴퓨터 플레이어 WALTON의 구조 조사(영문 메모, 2026-10-16). 아직 옮기지 않음. 한국어 요약과 확장 계획은 ai.md 5.2. -->

# WARRIORS.WALTON (UN computer player) — structural survey

Read-only survey of KOREA.EXE module WARRIORS (asm: `data/extracted/asm/WARRIORS.asm`). Purpose: enough structure to port
WALTON later as a UN AI next to the Communist AI (KIM). Addresses are WARRIORS offsets.

Conventions used below
- Unit field address = 0x7BF + 0x47*i + field. Disassembler mislabels them: `ROUTE+471h` = SYMBOL (0x7BF), `R+ah` = STATUS,
  `R+dh` = MOVE, `R+fh` = ATTACHED, `R+11h` = MAP_X, `R+13h` = MAP_Y, `UNITS+...` = a fixed unit's field.
- TERRAIN[x][y] = 0x5668 + 0x14A*x + 5*y; byte 0 terrain code (0x93 city, >= 0xA5 sea/off-map), byte 1 possession
  (1 UN, 2 Communist), bytes 3/4 force leaders of the hex (stack slots). `REPLACEMENTS+d1h` annotations are TERRAIN byte 3/4 reads.
- SYMBOL div 10 = nationality: 0 US, 1 USMC, 2 CW, 3 UN, 4 ROK, 5 NKPA, 6 CPLA. CORPS[0..3] = NKPA, CPLA, ROK, UN unit-id ranges.
- Nesting is recovered from the static link: `push bp; call X` = X is a child of the caller; `push [bp+4]; call X` = sibling.
- Push order = Pascal declaration order (first pushed = first parameter). Signatures below list parameters in push order.

## 0. Where WALTON's code really is (symbol ranges are misleading)

- KIM's symbol range (29df, 13078 bytes) runs to 5cf5, but KIM's own body is 29df..2c30 (`retf`). Everything from **2c85 to 5cf4 is
  WALTON's nested code** (strings sit in 2c31..2c84 and 3c0a..3c53, so the proc starts at 2c85 and 3c54 are hidden from a naive
  "push bp / mov bp,sp after ret" scan).
- **5e4a..65ef is not part of WALTON**: it is the WARRIORS unit initialisation block (runs once at program start). It fills the
  AISUBS global ROUTE (array[4] of array[72] of (X,Y) integers), see section 4.
- Unit-level (non-nested, no static link) procedures in 0000..0b79 are **shared by KIM and WALTON**:
  `0000(u)` absorb force, `0278(u, route)` march along a ROUTE, `0605(u)` which ROUTE the unit is on (99 = none).

Nesting tree of WALTON (address, ret size):

```
WALTON 5cf5 (retf)
  34fc  MERGE_STACK(u)                       ret 4   [children 2c85, 329b]
    2c85  merge 2nd force of hex into 1st + auto-name   ret 2
    329b  CAN_MERGE(l1, l2) -> boolean       ret 6
  5b63  CORPS_LOOP                            ret 2   [children below]
    3c54  OBJECTIVE(u, var score, var X, var Y, mode)   ret 12h  (the 2356-line monster)  [children 368c..3b0e]
      368c  SET_OBJ(x, y)          36bb FORCE_OBJ(x, y)     36df FORCE_OBJ_IF_WEAK(x, y)
      3705  CAND_NORTH: boolean    372e WAYPOINT(xf, yf, xt, yt)
      38ca  AMPHIB_INVASION        [children 3787 CAN_LAND(x,y), 3828 LAND(x1,y1,x2,y2)]
      3966  HOLD_IF_AT(x, y)       39c9 SHIP_FROM_JAPAN(u)  3b0e MERGE_RENAME(u, x, y, name)
    52f8  MOVE_FORCE(flag, u)                 ret 6
    5369  ATTACK_OK(x0, y0, tx, ty, k) -> boolean  ret 0Ch
    53e9  PLAN_COMBAT(flag, k)                ret 6
    5b3a  CAUTIOUS: boolean                   ret 2
```
(3787/3828 are children of 38ca: 38ca calls them with `push bp`; 3828 reaches 5b63's frame via three static links.)

## 1. WALTON body 5cf5 (order of operations)

1. `AISUBS.INIT_KIMWALTON(var showTroops)`; screen text "Walton is thinking..." / "Moving Units" / ("Planning Combat" only in the
   first orders phase, i.e. GOTO_SECONDPHASE = 0).
2. `SHOW_MOVE(0, j)` for j = FIRSTUNUNIT..255; in the first orders phase also `SHOW_MOVE(1, j)` (display bookkeeping).
3. `5b63` CORPS_LOOP (all decisions).
4. Airfield cheat: for AIRFIELDS[0..8]: if the hex is UN-held and CURRENT_STATUS = 0 then CURRENT_STATUS := 1.
   (KIM has the same loop for Communist-held airfields, `2b8e`.)
5. "Ok, Walton has finished his move...", SHOW_TROOPS := saved value, CONTINUE, SCROLL_MENU_PROMPT.

No air-operations code (the program's automatic missions in AIRCMBT handle the computer side), **no airdrop** (WALTON never touches
AIRLIFT_DEMAND / SYMBOL 82, so the 187th never jumps), sea movement only through the scripted TELEPORTs below.

## 2. CORPS_LOOP 5b63 (the driver; KIM counterpart 269d)

```
for k := 2 to 3 do                      { CORPS[2] = ROK army, CORPS[3] = other UN }
  flag := ord(CAUTIOUS)                 { 5b3a: true unless 10 < TURN < CCF_INTERVENTION }
  rate := NATIONAL_MOVEMENT_RATE(CORPS[k].from)       { read by children as parent [bp-10h] }
  for pass := 0 to 2 do                 { three movement passes }
    for u := CORPS[k].from to CORPS[k].to do
      if VALID_UNIT(u) then begin
        if FORCE_FLAG(u) and MAP_X(u) >= 0 and MAP_Y(u) > 1 then MOVE_FORCE(flag, u)   { 52f8 }
        SHOW_MOVE(0, u)
      end
  if first orders phase then begin PLAN_COMBAT(flag, k); SHOW_MOVE(1, u) for every u of corps k end
```
5b63 locals used by children: [bp-4] = k (FRIEND_ADJACENT's "army" argument), [bp-6] = pass, [bp-8]/[bp-0Ah] = objective X/Y,
[bp-10h] = rate, [bp-13h] = "amphibious landing made this turn" (set by 3828, blocks SHIP_FROM_JAPAN).

`5b3a` CAUTIOUS: `not (TURN > 10 and TURN < CCF_INTERVENTION)`. So flag 0 = the UN offensive window (turn 11 until the Chinese come),
flag 1 = early war and after Chinese intervention.

## 3. Per-force movement

### 52f8 MOVE_FORCE(flag, u)  (KIM 1e41)
```
OBJECTIVE(u, flag {var: in = flag, out = score}, objX, objY, mode 0)     { 3c54 }
if score > 4 or FIND_ROUTE(u) = 99 then MOVE_TO_OBJECTIVE(2, u, objX, objY)   { AISUBS 0be8, push order }
else MARCH_ROUTE(u, FIND_ROUTE(u))                                       { shared 0278 }
MERGE_STACK(u)                                                           { 34fc }
```
The by-value flag is passed to 3c54 as a var: 3c54 reads it to choose the search window and overwrites it with the best score.

### Shared unit-level helpers (also used by KIM)
- `0605` FIND_ROUTE(u) -> route index or 99. Communist units test ROUTE[0..1], UN units ROUTE[2..3] (the reversed copies) via its
  child `054f`; Communists keep the first match, UN the last.
- `0278` MARCH_ROUTE(u, r): moves the force along ROUTE[r] (children `011d` stop test: ARTY, enemy adjacent, Seoul (14,40) rule for
  units >= 0xBB; `01dd` "next step affordable": MOVE + MOVEUNIT.MOVE_COST <= NATIONAL_MOVEMENT_RATE). Not surveyed in detail.
- `0000` ABSORB(u): if u shares its hex with another force, u is appended to the end of the other force's ATTACHED chain and its
  stack slot is cleared (byte 4 cleared, byte 3 takes the survivor).

### 3c54 OBJECTIVE(u, var score, var X, var Y, mode)  (KIM 0f4d; children 368c..3b0e mirror KIM 0e25/0e54/0e70/0e9f/0ef4)
Called with mode 0 by MOVE_FORCE and mode 1 by PLAN_COMBAT. Code for mode 2 exists (score 16 only for hexes others already attack)
but WALTON never passes 2 (shared design with KIM).

Locals/flags computed first:
- isROK = SYMBOL div 10 = 4; x0, y0 = MAP_X/Y; corps = GET_CORPS(u); stronger = AISUBS.STRONGER(u, x0, y0)
- [bp-29h] mayRedeploy = second orders phase and TURN > 11 and not ARTY(u) and STATUS bit 4 (moved) clear
- [bp-24h] advance = (TERRAIN[14][40].possession = UN (Seoul) or SCENARIO = 4 or isROK) and TURN > 9
- [bp-28h] eastOnly1995 = SCENARIO 4 and u in {84h, 92h, 96h..99h, 9Bh, 9Ch, 9Eh} (never consider x <= 18)
- [bp-23h] crisis = TURN < 14 and (TURN < 9 or any Communist hex on row 49)  (Pusan perimeter)
- [bp-25h] noChina = CCF_INTERVENTION = 88; [bp-26h] = no Communist hex in row 29, x 7..16 (only computed when China may come)
- search window: mode 1: rows y0-1..y0+1, cols x0-2..x0+2. mode 0: flag 0 -> rows y0-5..y0+5, cols +-5; flag 1 -> rows y0-3..y0+6, cols +-4.

Hex scoring loop (best starts at own hex, score 0; SET_OBJ 368c records X/Y and score): skip hexes not ON_MAP or not
AISUBS.TERRAIN_OK(u,x,y), eastOnly1995 with x <= 18, and (not advance) with y <= 37.
- ARTY(u): 2 if hex is north of the unit and flag <> 0, else 1 for its own hex; +2 if a UN force is there; 0 if the hex touches
  the enemy (ENEMY_ADJACENT) or MOVEUNIT.NEAR_THE_FRONT(x, y, 2). Artillery sits just behind the line with friends.
- other units only score **Communist-held** hexes: base 3 (TERRAIN_CHECK code ranges 57h..0Bh or 7Ch..68h) or 5 (city 0x93) when
  flag <> 0 and the hex is north; +1 when no friendly army (FRIEND_ADJACENT(k) / (-k)) touches it. Occupied enemy hex: 5..7 depending on
  stronger / friends adjacent / AISUBS.OTHERS_ATTACKING + NOT_ADJACENT, 0 when the other army is next to it, plus (6 - DIST).
  Early war (TURN < 8, 1950s, DIST <= 3, ROK): FORCE_OBJ(x0, y0) = ROK units hold.
- +8 when flag = 0, score > 0 and the hex is not north (mop up bypassed pockets during the offensive window)
- y < 36 and score > 0: +4 in the own sector (ROK x >= 14, others x <= 13)
- empty enemy hexes are zeroed in no-go areas: y >= 62; x <= 14 and 41 <= y <= 51; x <= 6 and y <= 28; x <= 5 and y <= 31;
  x <= 6 and y >= 25; advance and TURN < CCF; y < 29 while China may intervene.
- tie-breaks: higher score wins; equal score > 4 -> the closer hex; equal score 1..4 -> RND(1,3) = 1.

After the loop (mode 0):
- no objective found, advance allowed and (noChina or y0 > 30): every Communist-held city scores 61 - DIST (+80 in the own sector),
  /20 -> march on enemy cities.
- y0 < 29 and China may intervene: pull back to row 29 (x0, 29) or (RND(14,16), 29).
- advance, nothing found and noChina: go to Communist SUPPLY_POINTS[u mod 7] if it is Communist-held.
- **scripted orders** (FORCE_OBJ 36bb = score 20, or FORCE_OBJ_IF_WEAK 36df when score < 5), by scenario/unit/turn; table extracted in
  `ai-walton-script.txt` next to this file (129 call sites). Highlights:
  - Dragon Wakes (SCENARIO 1): ~35 unit-specific objectives for turns 0..11 (units 9Fh..D3h), TELEPORT A6h to (28,56) on turn 1
    if not storm and ADh to (24,50) (each SEALIFT_DEMAND + 1), turn 3 consolidation: ABSORB C5h/C7h/C6h + rename "US 1st Cav Div",
    later "US 2nd Div" (CEh/D0h/D2h); C2h sealifted to (27,52) or (28,56).
  - 1950s, any scenario: HOLD_IF_AT (7,29) P'yongyang / (17,24) depending on noChina; from turn 43 units on a city hold it.
  - Inchon: SCENARIO <= 2, first orders phase, not storm, unit 216 (D8h) still at x = 33, y > 20 -> AMPHIB_INVASION (38ca).
  - Japan shuttle: unit at (33, y > 20) or on sea terrain, SEALIFT_DEMAND < 4, no landing this turn -> SHIP_FROM_JAPAN (39c9).
  - 1950s units D7h, E2h, E7h, EBh, ECh, F3h: fixed garrison hexes.
  - 1995 (SCENARIO 4, 4acd..5081): turn 0 builds "ROK 1/2/3 Army Arty" by MERGE_RENAME (86h,88h,89h,8Ah at (15,41); 85h,87h at
    (17,40); 84h,8Bh at (20,38)); ~40 unit-specific DMZ positions for turns 0..2 (units 7Ch..B9h), MERGE_STACK calls for A1h/A3h/A5h/
    AEh/B0h/B2h; turns 1..4 artillery hold; from turn 14 units in cities hold.
  - 3rd pass of the second orders phase, mayRedeploy, not in a city, not ARTY, no enemy adjacent: random shuffle to
    (x0 + RND(1,7) - 4, y0 + RND(1,5) - 3).
- WAYPOINT table (372e, mode <> 1, neither hex next to the enemy; "from" -> "to"): (9,38)->(10,37), (19,39)->(19,40),
  (15,18)->(16,18), (5,38)->(6,36), (11,51)->(14,50), (12,50)->(14,50), (1,25)/(2,24)/(3,24)->(4,23), (17,30)->(16,29),
  (12,45)/(9,46)->(13,47), (13,47)->(15,46), (21,61)->(20,59), (19,61)->(17,61), [score < 20] (12,52)->(17,50),
  [1950s] (12,41)->(14,41). These unstick forces at peninsulas/coasts (Inchon, Kunsan, Ongjin, south coast).
- Withdrawal (mode 0): in the second orders phase (or GOTO_PLAYERPHASE = 2), not stronger, AISUBS.SURROUNDED(x0,y0), not in a city
  -> AISUBS.WITHDRAW(-1, X, Y), score 5. From turn 1, artillery next to the enemy also withdraws.
- Final score: +5 if crisis and y0 < 46, +5 if China may intervene and y0 < 37; score is returned in the var; X clamped 0..33, Y 0..64.

Small children of 3c54
- `368c` SET_OBJ(x, y): X := x, Y := y, best score copied to the output slot.
- `36bb` FORCE_OBJ(x, y): score := 20, SET_OBJ, mayRedeploy := false. `36df` FORCE_OBJ_IF_WEAK: same only if score < 5.
- `3705` CAND_NORTH: candidate y < unit y.  `3966` HOLD_IF_AT(x, y): unit is the first force at (x, y) -> FORCE_OBJ(x, y).
- `372e` WAYPOINT(xf, yf, xt, yt): see table.
- `3b0e` MERGE_RENAME(u, x, y, name): TELEPORT(u, x, y); if u became stack slot 2 there, clear slot 2, append u to the slot-1
  force's ATTACHED chain and set the leader's NAME1 := name.
- `39c9` SHIP_FROM_JAPAN(u): force leader in the Japan column (33, y > 20) while not storm, or already on sea/off-map terrain:
  TELEPORT to the northernmost (smallest Y) UN-held, unmined port whose 2nd stack slot is free; SEALIFT_DEMAND + 1.
- `38ca` AMPHIB_INVASION: Dragon Wakes first swaps the two stacks at (33,59) and ABSORBs unit CBh. Then 70%: if CAN_LAND(12,41)
  -> LAND at **Inchon (12,41) from sea (11,42)**; otherwise 70%: if CAN_LAND(12,52) -> LAND at **(12,52) from (11,53)** (Kunsan).
  - `3787` CAN_LAND(x, y): hex empty or Communist-held, and not a mined port.
  - `3828` LAND(x1, y1, x2, y2): CORPS_LOOP.landed := true, SEALIFT_DEMAND + 3. Empty beach: TELEPORT units D7h and D8h onto
    (x1, y1). Defended beach: TELEPORT them to the sea hex (x2, y2) and AISUBS.PLOT_ATTACK each from (x2,y2) into (x1,y1).

### 34fc MERGE_STACK(u)  (KIM 0c85 with children 0b7c ~ 329b, 068c ~ 2c85)
If u's hex holds two forces: count units of each chain and their branch-2 units (SYMBOL mod 10 = 2). If total units <= 6, total
branch-2 <= 4 and CAN_MERGE both ways -> 2c85 merges slot 2 into slot 1 (REPORTS.SORT_FORCE) and generates a name
("1st/2nd/3rd/nth ... Div", "ROK <roman> Corps", "ROK Cap Div", "CW Div", "USMC 1st/3rd Div").
`329b` CAN_MERGE(l1, l2): 1950s: same-nation rules (ROK only from turn 12, or at (17,51) after turn 3; USMC with USMC, CW with
CW), exclusions (units BEh before turn 5, DDh, C2h in scenario 1, E2h/E7h/EBh/ECh/F3h), not at (7,29)/(17,24), not on sea.
1995: same nationality, ROK only through turn 5, special cases 9Ch (turn 0) and A1h (turn 1), artillery only with artillery.

## 4. Combat planning 53e9 PLAN_COMBAT(flag, k)  (KIM 1f3f, target check 5369 ~ KIM 1ebf)

First orders phase only.
1. For row y = 1..64 (north to south), each force of corps k on that row with MOVE < rate - 6 and ENEMY_ADJACENT(x, y, 1):
   OBJECTIVE(u, score, tx, ty, mode 1); if ATTACK_OK(x, y, tx, ty, k) -> AISUBS.PLOT_ATTACK(u, x, y, tx, ty). Mark u as considered.
   `5369` ATTACK_OK: target Communist-held and occupied, TERRAIN_OK(u, tx, ty) and adjacent (not NOT_ADJACENT).
2. Odds check per plotted target (force MOVE > 100 -> EURSUBS1.DECODE of the direction): attack = sum over corps forces
   AISUBS.ASSAULTING the target (each counted once) of GET_FORCE_STRENGTH mode 1 /10; artillery forces within DIST 2 of the target
   add (UN) or subtract (Communist) their mode-0 strength /10; total := total * 3 div 4; minus every defender's mode-2 strength /10.
   If the result < 0 -> MOVEUNIT.CLEAR_PLOTS for all corps forces attacking that hex (call the attack off).
3. Pile-on: every non-artillery force with MOVE < rate - 6 plots an attack on any adjacent hex that OTHERS_ATTACKING already
   targets (TERRAIN_OK), SHOW_MOVE.

## 5. ROUTE table (WARRIORS init 5e4a)

ROUTE[0] west axis, 71 points north->south: (0,22) (0,23) (1,24) (2,23) (3,24) (4,23) (5,24) (6,24) (6,25) (6,26) (6,27) (7,28)
(7,29) (7,30) (7,31) (7,32) (8,32) (9,33) (10,33) (10,34) (11,35) (11,36) (11,37) (12,36) (12,35) (13,35) (14,34) (15,35) (15,36)
(15,37) (15,38) (15,39) (15,40) (14,40) (14,41) (14,42) (15,43) (15,44) (15,45) (15,46) (16,46) (16,47) (16,48) (17,49) (17,50)
(16,50) (16,51) (15,52) (14,52) (14,53) (14,54) (13,55) (13,56) (12,56) (12,57) (12,58) (13,59) (14,58) (14,59) (15,60) (16,60)
(17,61) (18,60) (19,60) (20,59) (21,59) (22,59) (23,59) (24,59) (25,60) (26,59); ROUTE[0][71] = (0,0).
ROUTE[1] east axis, 72 points: (33,6) (32,6) (31,7) (31,8) (30,8) (30,9) (29,10) (28,10) (28,11) (28,12) (29,13) (29,14) (29,15)
(28,15) (27,16) (26,16) (25,17) (25,18) (25,19) (25,20) (24,20) (23,21) (22,21) (21,22) (20,22) (19,23) (18,23) (17,24) (16,24)
(16,25) (16,26) (15,27) (15,28) (16,28) (16,29) (16,30) (17,31) (17,32) (18,32) (18,33) (19,34) (20,34) (21,35) (22,35) (22,36)
(23,37) (23,38) (24,38) (24,39) (25,40) (25,41) (26,41) (26,42) (27,43) (27,44) (27,45) (28,45) (28,46) (28,47) (28,48) (28,49)
(28,50) (27,51) (27,52) (27,53) (27,54) (27,55) (27,56) (27,57) (26,57) (26,58) (26,59).
ROUTE[2][j] = ROUTE[0][71-j], ROUTE[3][j] = ROUTE[1][71-j] (south->north copies for the UN; ROUTE[2][0] is the (0,0) filler).

## 6. KIM <-> WALTON correspondence

| Role | KIM | WALTON | Notes |
|---|---|---|---|
| body | 29df..2c30 | 5cf5..5e49 | same frame: INIT_KIMWALTON, SHOW_MOVE loops, driver, airfield loop, CONTINUE. KIM adds turn-0 Dragon Wakes unit edits and the 2841 alerts ("ROK 3/7 Inf Rgt" ...) |
| driver | 269d | 5b63 | corps loop (KIM CORPS 0..1, WALTON 2..3), 3 passes, combat in phase 1 |
| cautious flag | 2674 | 5b3a | |
| per-force move | 1e41 | 52f8 | identical call pattern: objective, route (shared 0605/0278), merge |
| objective search | 0f4d (ret 12h) | 3c54 (ret 12h) | same signature and mode 0/1/2; generic scoring similar, scripted part side-specific |
| objective setters | 0e25, 0e54, 0e70, 0e9f, 0ef4 | 368c, 36bb, 36df, 3705/372e | 0ef4 is KIM's waypoint list (9 calls), 372e WALTON's (17) |
| merge stack | 0c85 (+0b7c, 068c) | 34fc (+329b, 2c85) | |
| attack target check | 1ebf (ret 0Ch) | 5369 (ret 0Ch) | |
| combat planning | 1f3f | 53e9 | |
| shared | 0000, 0278, 0605 | same | ROUTE 0/1 for KIM, 2/3 for WALTON |
| side-only | 2841 alerts | 3787/3828/38ca amphibious, 39c9 Japan shuttle, 3966, 3b0e | |

Porting hint: implement the shared skeleton once (driver -> per-force objective/route/merge -> combat planning with odds check) with
a side profile (corps indices, ROUTE indices, cautious rule, possession codes, scripted tables, side-only hooks). KIM fills it first;
WALTON then needs its scripted tables (w_script.txt), the amphibious/Japan hooks and its merge naming.

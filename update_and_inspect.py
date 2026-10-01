import re
import codecs

with codecs.open('SRS_THE_DAILY_LEDGER.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Turn Sequence & Property Resolution
old_seq = "*(Authoritative Sequence: MOVE → IDENTIFY SPACE → CHECK FOR FORCED STATE → RESOLVE SPECIAL SPACE → RESOLVE MANDATORY PAYMENT → OPTIONAL ACTIONS → END TURN)*"
new_seq = """*(Authoritative Sequence: MOVE → IDENTIFY SPACE → CHECK FOR FORCED STATE → RESOLVE PROPERTY OR SPECIAL SPACE → RESOLVE MANDATORY PAYMENT → OPTIONAL ACTIONS → END TURN)*

**Property Resolution (RESOLVE PROPERTY OR SPECIAL SPACE):**
*   **If owned by another player:** Resolve the applicable rent obligation as a mandatory payment. Complete rent, payment, and liquidity resolution before optional actions.
*   **If unowned:** Enter the Property Decision Window. Player may BUY at Asking Price or PASS. PASS triggers the Quick Auction rules defined by AUCTION_SYSTEM.md. Insufficient cash to buy forces a PASS / Auction.
*   **If owned by active player:** No rent payment. Continue to optional actions.
*(Note: Property resolution is distinct from Special Space resolution. Do not treat property landing as a generic special space).*
"""
content = content.replace(old_seq, new_seq)

# Update diagram text slightly to match
content = content.replace("RESOLVE_SPECIAL_SPACE : Normal/Special Space", "RESOLVE_PROPERTY_OR_SPECIAL_SPACE : Normal/Special Space")
content = content.replace("RESOLVE_SPECIAL_SPACE --> TRANSPORT", "RESOLVE_PROPERTY_OR_SPECIAL_SPACE --> TRANSPORT")
content = content.replace("RESOLVE_SPECIAL_SPACE --> INFO_DESK", "RESOLVE_PROPERTY_OR_SPECIAL_SPACE --> INFO_DESK")
content = content.replace("RESOLVE_SPECIAL_SPACE --> CIVIC_FINANCIAL", "RESOLVE_PROPERTY_OR_SPECIAL_SPACE --> CIVIC_FINANCIAL")
content = content.replace("RESOLVE_SPECIAL_SPACE --> RESOLVE_MANDATORY_PAYMENT", "RESOLVE_PROPERTY_OR_SPECIAL_SPACE --> RESOLVE_MANDATORY_PAYMENT")
content = content.replace("CHECK_FOR_FORCED_STATE --> RESOLVE_SPECIAL_SPACE", "CHECK_FOR_FORCED_STATE --> RESOLVE_PROPERTY_OR_SPECIAL_SPACE")

# 2. Final Current Yield Formula
old_dist = "*   **Loss of Control:** Immediately removes +5% modifiers and Network. Attached physical developments and Flagships are NOT destroyed."
new_dist = """*   **Loss of Control:** Immediately removes +5% modifiers and Network. Attached physical developments and Flagships are NOT destroyed.
*   **Final Current Yield Calculation:** District Control and Development Network effects are applied *after* the Market/development calculation.
    *   `PRE-DISTRICT CURRENT YIELD = Base Yield * (1.0 + (0.50 * Num_Primary_Cashflow) + (0.35 * Num_Secondary_Cashflow)) * Market Yield Modifier`
    *   `FINAL CURRENT YIELD = PRE-DISTRICT CURRENT YIELD * (1.0 + District_Control_Modifier + Network_Modifier)`"""
content = content.replace(old_dist, new_dist)

# 3. Early Endgame Trigger
old_end = "*   **Termination Triggers:** Reaching target round limit (e.g., Round 30) OR only 1 active player remains."
new_end = """*   **Termination Triggers:** Reaching target round limit (e.g., Round 30) OR only 1 active player remains.
    *   *Early Termination Trigger Details:* After a player is eliminated through the authoritative Finance/Bankruptcy resolution, the game checks the number of active players. If exactly one active player remains: complete the required elimination/state cleanup, immediately trigger early Endgame, and freeze the game according to the Endgame requirements. Do not create an additional round. Do not allow a new player turn. Do not resolve another Market Pulse."""
content = content.replace(old_end, new_end)

# 4. Implementation Readiness Language
old_ready = "*   **Implementation Readiness:** READY FOR IMPLEMENTATION."
new_ready = "*   **Implementation Readiness:** READY FOR IMPLEMENTATION. (This means the core game design is fully specified, locked design documents are reconciled into the SRS, and implementation may begin. Minor engineering decisions—such as disconnect timeout behavior and advanced bot trading heuristics—remain implementation-owned where explicitly marked, but do not block core engineering)."
content = content.replace(old_ready, new_ready)

with codecs.open('SRS_THE_DAILY_LEDGER.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("Markdown updated successfully.")

# Inspect Excel
import pandas as pd
try:
    xls = pd.ExcelFile('THE_DAILY_LEDGER_SRS.xlsx')
    print("Sheets:", xls.sheet_names)
    
    # Check across multiple sheets for "DESIGN DECISION REQUIRED"
    found = False
    for sheet in xls.sheet_names:
        df = pd.read_excel(xls, sheet)
        if df.apply(lambda x: x.astype(str).str.contains('DESIGN DECISION REQUIRED', na=False, case=False).any()).any():
            print(f"Found 'DESIGN DECISION REQUIRED' in sheet: {sheet}")
            found = True
            
    if not found:
        print("No 'DESIGN DECISION REQUIRED' found in any sheet.")

    if '03_BoardSpaces' in xls.sheet_names:
        df_spaces = pd.read_excel(xls, '03_BoardSpaces')
        print("City Desk row:", df_spaces[df_spaces.iloc[:,0].astype(str).str.contains("05")].values)
except Exception as e:
    print("Error reading excel:", e)

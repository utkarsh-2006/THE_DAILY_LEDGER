import codecs
import re

with codecs.open('SRS_THE_DAILY_LEDGER.md', 'r', 'utf-8') as f:
    md = f.read()

# Replace the text inside the Turn Loop line
md = re.sub(
    r"Move \u2192 Identify Space \u2192 Check Forced State \u2192 Resolve Special Space \u2192 Resolve Mandatory Payment \u2192 Optional Actions \u2192 End Turn",
    "Move \u2192 Identify Space \u2192 Check Forced State \u2192 Resolve Property or Special Space \u2192 Resolve Mandatory Payment \u2192 Optional Actions \u2192 End Turn",
    md
)

md = md.replace("RESOLVE_SPECIAL_SPACE", "RESOLVE_PROPERTY_OR_SPECIAL_SPACE")
md = md.replace("Resolve Special Space", "Resolve Property or Special Space")

with codecs.open('SRS_THE_DAILY_LEDGER.md', 'w', 'utf-8') as f:
    f.write(md)
print("MD fixed.")

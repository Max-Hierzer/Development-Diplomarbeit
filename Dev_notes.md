# DEV-NOTES
### Hier kommen notizen die für andere Entwickler wichtig sein könnten

**Problem mit Results calculation:**
*So sehen die Tatsächlichen ergebnisse des Polls aus*
| Poll | Description | Question           | Answer          | VoteCount |
|------|-------------|--------------------|-----------------|-----------|
| Test |             | Single             | 1               | 2         |
| Test |             | Single             | 2               | 1         |
| Test |             | Multi              | 1               | 1         |
| Test |             | Multi              | 2               | 3         |
| Test |             | Multi              | 3               | 1         |

*So werden die Prozente in Ergebnisse angezeigt*
| Poll | Description | Question           | Answer          | Percentage |
|------|-------------|--------------------|-----------------|------------|
| Test |             | Single             | 1               | 20.00%     |
| Test |             | Single             | 2               | 60.00%     |
| Test |             | Multi              | 1               | 20.00%     |
| Test |             | Multi              | 2               | 60.00%     |
| Test |             | Multi              | 3               | 20.00%     |

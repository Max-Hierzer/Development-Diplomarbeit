# DEV-NOTES
### Hier kommen notizen die für andere Entwickler wichtig sein könnten

#### Notiz zu Rollen
Multiple Choice Vote POST:
Submitting anonymous vote: {
  "answers": {
    "1": {
      "answers": [
        1,
        2
      ],
      "importance": null
    }
  }
}

Das Problem is das es ein Array von answers ist aber wenn es nicht multiple choice ist sondern single choice dannSubmitting anonymous vote: {
  "answers": {
    "2": {
      "answerId": 4,
      "importance": null
    }
  }
}
ist es kein array von answers

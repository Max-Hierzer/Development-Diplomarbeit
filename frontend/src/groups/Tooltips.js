import React from "react";
import { Tooltip } from "react-tooltip";

const TOOLTIP_DELAY = 1500; 

const tooltips = [
  { id: "group-name-tooltip", content: "Geben Sie Ihrer Gruppe einen Namen.", place: "right" },
  { id: "description-tooltip", content: "Beschreiben Sie hier Ihre Gruppe genauer.", place: "right" },
  { id: "delete-group-tooltip", content: "Hiermit löschen Sie Ihre Gruppe.", place: "right" },
  { id: "export-group-tooltip", content: "Teilnehmer der Gruppe in eine CSV-Datei exportieren.", place: "right" },
  { id: "save-changes-tooltip", content: "Speichern der Änderungen.", place: "right" },
  { id: "remove-users-tooltip", content: "Wählen Sie die Nutzer, die Sie entfernen wollen.", place: "right" },
  { id: "add-users-tooltip", content: "Wählen Sie die Nutzer, die Sie hinzufügen wollen.", place: "right" },
  { id: "select-group-tooltip", content: "Wählen Sie die Gruppe aus die Sie bearbeiten wollen.", place: "right" },
  { id: "save-group-tooltip", content: "Hiermit erstellen Sie Ihre Gruppe.", place: "right" },
  { id: "edit-group-tooltip", content: "Wechseln zum Bearbeitungsmodus.", place: "right" },
  { id: "create-group-tooltip", content: "Wechseln zum Erstellungsmodus.", place: "right" },
];

const CustomTooltips = () => {
  return (
    <>
      {tooltips.map(({ id, content, place }) => (
        <Tooltip key={id} id={id} content={content} place={place} delayShow={TOOLTIP_DELAY} />
      ))}
    </>
  );
};

export default CustomTooltips;

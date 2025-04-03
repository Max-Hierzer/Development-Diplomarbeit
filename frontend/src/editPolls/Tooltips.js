import React from "react";
import { Tooltip } from "react-tooltip";

const TOOLTIP_DELAY = 1500; 

const tooltips = [
  { id: "poll-name-tooltip", content: "Geben Sie den gewünschten Titel ihrer Umfrage an.", place: "right" },
  { id: "description-tooltip", content: "Beschreiben Sie hier, worum es in Ihrer Umfrage geht.", place: "right" },
  { id: "public-tooltip", content: "Soll Ihre Umfrage öffentlich oder nur unter den Nutzern dieser Plattform möglich sein.", place: "right" },
  { id: "anonym-tooltip", content: "Sollen die Stimmen Ihrer Umfrage anonym oder rückverfolgbar sein", place: "right" },
  { id: "add-group-tooltip", content: "Hier können sie noch weitere Gruppen zur Umfrage hinzufügen.", place: "right" },
  { id: "remove-group-tooltip", content: "Hier können sie Gruppen von der Umfrage entfernen", place: "right" },
  { id: "start-tooltip", content: "Wann soll ihre Umfrage Starten. (WICHTIG: Startzeitpunkt muss in der Zukunft liegen.)", place: "bottom" },
  { id: "end-tooltip", content: "Wann soll ihre Umfrage Enden. (WICHTIG: Endzeitpunkt muss nach Startzeitpunkt sein.)", place: "bottom" },
  { id: "image-tooltip", content: "Fügen Sie ein Themenbild für Ihre Umfrage hinzu.", place: "right" },
  { id: "questiontype-tooltip", content: "Wählen sie eine Art von Frage aus.", place: "right" },
  { id: "question-tooltip", content: "Geben Sie Ihre gewünschte Frage ein.", place: "left" },
  { id: "answer-tooltip", content: "Geben Sie Ihre gewünschte Antwort ein.", place: "left" },
  { id: "answer-add-tooltip", content: "Fügen Sie eine weitere Antwort hinzu.", place: "right" },
  { id: "answer-delete-tooltip", content: "Hiermit löschen Sie diese Antwort.", place: "right" },
  { id: "question-add-tooltip", content: "Fügen Sie eine weitere Frage hinzu.", place: "right" },
  { id: "question-delete-tooltip", content: "Hiermit löschen Sie diese Frage.", place: "right" },
  { id: "submit-tooltip", content: "Wenn Sie hier klicken wird die Umfrage erstellt.", place: "right" }
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

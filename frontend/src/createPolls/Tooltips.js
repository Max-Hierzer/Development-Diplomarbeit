import React from "react";
import { Tooltip } from "react-tooltip";

const CustomTooltips = () => {
  return (
    <>
      <Tooltip id="poll-name-tooltip" content="Geben Sie den gewünschten Titel ihrer Umfrage an." place="right" />
      <Tooltip id="description-tooltip" content="Beschreiben Sie hier, worum es in Ihrer Umfrage geht." place="right" />
      <Tooltip id="public-tooltip" content="Soll Ihre Umfrage öffentlich oder nur unter den Nutzern dieser Plattform möglich sein." place="right" />
      <Tooltip id="anonym-tooltip" content="Sollen die Stimmen Ihrer Umfrage anonym oder rückverfolgbar sein" place="right" />
      <Tooltip id="group-tooltip" content="Mit welchen Gruppen wollen Sie ihre Umfrage teilen." place="right" />
      <Tooltip id="start-tooltip" content="Wann soll ihre Umfrage Starten. (WICHTIG: Startzeitpunkt muss in der Zukunft liegen.)" place="left" />
      <Tooltip id="end-tooltip" content="Wann soll ihre Umfrage Enden. (WICHTIG: Endzeitpunkt muss nach Startzeitpunkt sein.)" place="right" />
      <Tooltip id="image-tooltip" content="Fügen Sie ein Themenbild für Ihre Umfrage hinzu." place="right" />
      <Tooltip id="questiontype-tooltip" content="Wählen sie eine Art von Frage aus." place="right" />
      <Tooltip id="question-tooltip" content="Geben Sie Ihre gewünschte Frage ein." place="left" />
      <Tooltip id="answer-tooltip" content="Geben Sie Ihre gewünschte Antwort ein." place="left" />
      <Tooltip id="answer-add-tooltip" content="Fügen Sie eine weitere Antwort hinzu." place="right" />
      <Tooltip id="answer-delete-tooltip" content="Hiermit löschen Sie diese Antwort." place="right" />
      <Tooltip id="question-add-tooltip" content="Fügen Sie eine weitere Frage hinzu." place="right" />
      <Tooltip id="question-delete-tooltip" content="Hiermit löschen Sie diese Frage." place="right" />
      <Tooltip id="submit-tooltip" content="Wenn Sie hier klicken wird die Umfrage erstellt." place="right" />
    </>
  );
};

export default CustomTooltips;

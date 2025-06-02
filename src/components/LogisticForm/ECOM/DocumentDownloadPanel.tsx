import style from "../LogisticForm.module.css";
import {Button} from "antd";
import type {submitActionsType} from "../../../typesForm";

interface DocumentDownloadPanelProps {
    setSubmitType: (value: submitActionsType) => void
}

export const DocumentDownloadPanel = ({setSubmitType}: DocumentDownloadPanelProps) => {
  return (
      <div className={style.buttonContainer}>
          <Button
              htmlType="submit"
              onClick={() => setSubmitType('invoice')}
          >
              Скачать ТН
          </Button>
          <Button
              htmlType="submit"
              onClick={() => setSubmitType('route')}
          >
              Скачать МЛ
          </Button>
      </div>
  )
}
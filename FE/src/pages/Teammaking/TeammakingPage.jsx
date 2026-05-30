import { useState } from "react";
import logoIcon from "../../assets/logoIcon.svg";
import DomainSelector from "./components/DomainSelector.jsx";
import FormActions from "./components/FormActions.jsx";
import ProjectDescriptionField from "./components/ProjectDescriptionField.jsx";
import ProjectNameField from "./components/ProjectNameField.jsx";
import ProjectPeriodField from "./components/ProjectPeriodField.jsx";
import "./TeammakingPage.css";

const domainOptions = [
  { id: "assignment", label: "조별과제" },
  { id: "study", label: "스터디" },
  { id: "contest", label: "공모전" },
  { id: "dev", label: "개발" },
  { id: "etc", label: "기타" },
];

const getTodayValue = () => {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000;

  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
};

function TeammakingPage() {
  const todayValue = getTodayValue();
  const [projectName, setProjectName] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("assignment");
  const [recruitCount, setRecruitCount] = useState("1");
  const [startDate, setStartDate] = useState(todayValue);
  const [endDate, setEndDate] = useState(todayValue);
  const [description, setDescription] = useState("");
  const isSubmitEnabled = projectName.trim() !== "" && description.trim() !== "";

  const handleCancel = () => {
    setProjectName("");
    setSelectedDomain("assignment");
    setRecruitCount("1");
    setStartDate(todayValue);
    setEndDate(todayValue);
    setDescription("");
  };

  const handleStartDateChange = (value) => {
    setStartDate(value);

    if (endDate < value) {
      setEndDate(value);
    }
  };

  const handleSubmit = () => {
    if (!isSubmitEnabled) return;

    const selectedDomainLabel =
      domainOptions.find((option) => option.id === selectedDomain)?.label ?? selectedDomain;

    alert(
      `프로젝트 생성!\n이름: ${projectName}\n분야: ${selectedDomainLabel}\n모집 인원: ${recruitCount}명\n기간: ${startDate} ~ ${endDate}\n설명: ${description}`,
    );
  };

  return (
    <div className="page-wrapper">
      <h1 className="teammaking-page-title">프로젝트 생성</h1>
      <div className="card">
        <div className="teammaking-logo-box" aria-hidden="true">
          <img src={logoIcon} alt="" />
        </div>
        <ProjectNameField
          projectName={projectName}
          onProjectNameChange={setProjectName}
        />
        <DomainSelector
          domainOptions={domainOptions}
          selectedDomain={selectedDomain}
          onDomainChange={setSelectedDomain}
        />
        <div className="form-field recruit-count-field">
          <label className="teammaking-form-label" htmlFor="recruit-count">
            모집 인원
          </label>
          <select
            id="recruit-count"
            className="recruit-count-select"
            value={recruitCount}
            onChange={(event) => setRecruitCount(event.target.value)}
          >
            {Array.from({ length: 10 }, (_, index) => String(index + 1)).map((count) => (
              <option key={count} value={count}>
                {count}명
              </option>
            ))}
          </select>
        </div>
        <ProjectPeriodField
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={setEndDate}
        />
        <ProjectDescriptionField
          description={description}
          onDescriptionChange={setDescription}
        />
        <FormActions
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          isSubmitEnabled={isSubmitEnabled}
        />
      </div>
    </div>
  );
}

export default TeammakingPage;

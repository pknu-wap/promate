import { useState } from "react";
import logoIcon from "../../assets/logoIcon.svg";
import DomainSelector from "./components/DomainSelector.jsx";
import FormActions from "./components/FormActions.jsx";
import ProjectDescriptionField from "./components/ProjectDescriptionField.jsx";
import ProjectNameField from "./components/ProjectNameField.jsx";
import "./TeammakingPage.css";

const domainOptions = [
  { id: "assignment", label: "조별과제" },
  { id: "study", label: "스터디" },
  { id: "contest", label: "공모전" },
  { id: "dev", label: "개발" },
  { id: "etc", label: "기타" },
];

function TeammakingPage() {
  const [projectName, setProjectName] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("assignment");
  const [description, setDescription] = useState("");
  const isSubmitEnabled = projectName.trim() !== "" && description.trim() !== "";

  const handleCancel = () => {
    setProjectName("");
    setSelectedDomain("assignment");
    setDescription("");
  };

  const handleSubmit = () => {
    if (!isSubmitEnabled) return;

    const selectedDomainLabel =
      domainOptions.find((option) => option.id === selectedDomain)?.label ?? selectedDomain;

    alert(
      `프로젝트 생성!\n이름: ${projectName}\n분야: ${selectedDomainLabel}\n설명: ${description}`,
    );
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">프로젝트 생성</h1>
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

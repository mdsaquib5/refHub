import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getJobByJobCode, createReferral } from "../../api/referApi";

const CreateReferral = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [jobCode, setJobCode] = useState("");
  const [jobDetails, setJobDetails] = useState(null);
  const [jobLoading, setJobLoading] = useState(false);
  const [jobError, setJobError] = useState("");

  const [formData, setFormData] = useState({
    candidateName: "",
    email: "",
    mobile: "",
    currentDesignation: "",
    currentOrganization: "",
    totalExperience: "",
    currentCTC: "",
    expectedCTC: "",
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const code = searchParams.get("jobCode");
    if (code) {
      setJobCode(code);
      searchJobByCode(code);
    }
  }, [searchParams]);

  const searchJobByCode = async (code) => {
    setJobLoading(true);
    setJobError("");
    setJobDetails(null);
    try {
      const job = await getJobByJobCode(code);
      if (!job) {
        setJobError("Invalid Job Code");
      } else {
        setJobDetails(job);
      }
    } catch {
      setJobError("Failed to fetch job");
    } finally {
      setJobLoading(false);
    }
  };

  const handleJobSearch = async () => {
    if (!jobCode.trim()) return;
    await searchJobByCode(jobCode.trim());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      toast.error("Only PDF files are allowed");
      e.target.value = "";
    }
  };

  const formatSalary = (min, max) => {
    if (min == null || max == null) return "-";
    const format = (n) =>
      n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString()}`;
    return `${format(min)} - ${format(max)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Resume PDF is required");
      return;
    }

    if (!jobDetails?._id) {
      toast.error("Please select a valid job first");
      return;
    }

    setIsSubmitting(true);

    const payload = new FormData();
    payload.append("jobPostId", jobDetails._id);
    payload.append("candidateName", formData.candidateName);
    payload.append("candidateEmail", formData.email);
    payload.append("mobile", formData.mobile);
    payload.append("currentDesignation", formData.currentDesignation);
    payload.append("currentOrganization", formData.currentOrganization);
    payload.append("totalExperience", formData.totalExperience);
    payload.append("currentCTC", formData.currentCTC);
    payload.append("expectedCTC", formData.expectedCTC);
    payload.append("skillSet", skills.join(","));
    payload.append("resume", selectedFile);

    try {
      await createReferral(payload);
      toast.success("Referral created successfully!");
      navigate("/dashboard/referrals");
    } catch (err) {
      toast.error(err.response?.data?.message || "Referral failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-referral">
      <div className="referral-container">
        <div className="form-header">
          <div>
            <h1>Create Referral</h1>
            <p>Search job by Job Code and refer a candidate</p>
          </div>
        </div>

        <div className="referral-form">
          {/* Job Search */}
          <div className="form-section">
            <h2>Job Search</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Job Code</label>
                <input
                  type="text"
                  placeholder="Enter Job Code (e.g. JOB-614376)"
                  value={jobCode}
                  onChange={(e) => setJobCode(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="submit-btn"
                onClick={handleJobSearch}
                disabled={jobLoading}
              >
                {jobLoading ? "Searching..." : "Search Job"}
              </button>
            </div>

            {jobError && <p className="error-message">{jobError}</p>}

            {jobDetails && (
              <div className="job-summary-card">
                <h3>{jobDetails.jobBasics?.title}</h3>
                <div className="job-summary-grid">
                  <p>
                    <strong>Job Code:</strong> {jobDetails.jobCode}
                  </p>
                  <p>
                    <strong>Company:</strong> {jobDetails.organizationName}
                  </p>
                  {jobDetails.locations?.length > 0 && (
                    <p>
                      <strong>Locations:</strong>{" "}
                      {jobDetails.locations.join(", ")}
                    </p>
                  )}
                  {jobDetails.jobBasics?.department && (
                    <p>
                      <strong>Department:</strong>{" "}
                      {jobDetails.jobBasics.department}
                    </p>
                  )}
                  {jobDetails.experience && (
                    <p>
                      <strong>Experience:</strong> {jobDetails.experience.min} -{" "}
                      {jobDetails.experience.max} yrs
                    </p>
                  )}
                  {jobDetails.salaryRange && (
                    <p>
                      <strong>Salary:</strong>{" "}
                      {formatSalary(
                        jobDetails.salaryRange.min,
                        jobDetails.salaryRange.max
                      )}{" "}
                      /yr
                    </p>
                  )}
                  {jobDetails.workplace?.workType && (
                    <p>
                      <strong>Work Type:</strong> {jobDetails.workplace.workType}
                    </p>
                  )}
                  {jobDetails.skillsRequired?.length > 0 && (
                    <p>
                      <strong>Skills:</strong>{" "}
                      {jobDetails.skillsRequired.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Candidate Form */}
          {jobDetails && (
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h2>Candidate Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      name="candidateName"
                      value={formData.candidateName}
                      placeholder="Candidate's full name"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      placeholder="candidate@example.com"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Mobile</label>
                    <input
                      name="mobile"
                      type="tel"
                      value={formData.mobile}
                      placeholder="10-digit mobile number"
                      pattern="[0-9]{10}"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Current Designation</label>
                    <input
                      name="currentDesignation"
                      value={formData.currentDesignation}
                      placeholder="e.g. Senior Developer"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Current Organization</label>
                    <input
                      name="currentOrganization"
                      value={formData.currentOrganization}
                      placeholder="e.g. TCS, Infosys"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Total Experience (years)</label>
                    <input
                      name="totalExperience"
                      type="number"
                      value={formData.totalExperience}
                      placeholder="e.g. 2.5"
                      step="0.1"
                      min="0"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Current CTC</label>
                    <input
                      name="currentCTC"
                      type="number"
                      value={formData.currentCTC}
                      placeholder="e.g. 600000"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Expected CTC</label>
                    <input
                      name="expectedCTC"
                      type="number"
                      value={formData.expectedCTC}
                      placeholder="e.g. 900000"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="form-section">
                <h2>Skills</h2>
                <div className="skills-input-group">
                  <div className="skill-input-wrapper">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a skill and press Enter"
                      className="skill-input"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="add-skill-btn"
                    >
                      Add
                    </button>
                  </div>
                  {skills.length > 0 && (
                    <div className="skills-list">
                      {skills.map((skill) => (
                        <span key={skill} className="skill-tag">
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="remove-skill"
                          >
                            x
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Resume Upload */}
              <div className="form-section">
                <h2>Resume</h2>
                <div className="file-upload">
                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <label htmlFor="resume-upload" className="file-label">
                    <span className="upload-icon">+</span>
                    <div className="upload-text">
                      <span className="primary-text">
                        {selectedFile
                          ? selectedFile.name
                          : "Click to upload resume"}
                      </span>
                      <span className="secondary-text">
                        {selectedFile
                          ? `(${(selectedFile.size / 1024).toFixed(1)} KB)`
                          : "PDF files only (Max 10MB)"}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Create Referral"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateReferral;

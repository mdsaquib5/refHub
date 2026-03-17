import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";
import { MdAttachFile, MdPerson, MdCancel } from "react-icons/md";
import {
  HiOutlineCode,
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
} from "react-icons/hi";
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
    if (!code) return;
    setJobLoading(true);
    setJobError("");
    setJobDetails(null);
    try {
      const job = await getJobByJobCode(code);
      if (!job) {
        setJobError("No job found with this code. Please verify.");
      } else {
        setJobDetails(job);
      }
    } catch {
      setJobError("Failed to fetch job details. Please try again.");
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
      toast.error("Candidate Resume (PDF) is required");
      return;
    }

    if (!jobDetails?._id) {
      toast.error("Please search and select a valid job first");
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
      toast.success("Candidate referred successfully!");
      navigate("/dashboard/referrals");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-referral-page">
      <div className="referral-header-section" style={{ marginBottom: '40px' }}>
        <h1 className="page-title">Refer a Candidate</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Help your friends join Alten India by referring them for open positions.</p>
      </div>      <div className="referral-form-layout animate-fade-in">
        {/* Step 1: Job Selection */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <div className="flex-row">
              <div className="stat-icon" style={{ width: '32px', height: '32px', borderRadius: '8px', fontSize: '14px' }}>1</div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Target Opportunity</h3>
            </div>
          </div>

          <div className="card-body">
            <div className="form-group">
              <label>Enter Job Code</label>
              <div className="flex-row" style={{ gap: '12px' }}>
                <div className="search-input-group">
                  <HiOutlineCode size={18} />
                  <input
                    type="text"
                    placeholder="e.g. JOB-827806"
                    value={jobCode}
                    onChange={(e) => setJobCode(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleJobSearch}
                  disabled={jobLoading}
                >
                  {jobLoading ? "..." : "Fetch"}
                </button>
              </div>
            </div>

            {jobError && (
              <div className="text-xs danger-text flex-row" style={{ marginTop: '10px' }}>
                <MdCancel /> {jobError}
              </div>
            )}

            {jobDetails && (
              <div className="info-item" style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <span className="text-xs success-text" style={{ fontWeight: 800 }}>POSITION VERIFIED</span>
                <h4 style={{ color: '#fff', fontSize: '16px', margin: '4px 0 12px' }}>{jobDetails.jobBasics?.title}</h4>
                <div className="grid-2">
                  <div className="info-item">
                    <span className="info-label">Company</span>
                    <span className="info-value">{jobDetails.organizationName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">ID</span>
                    <span className="info-value">{jobDetails.jobCode}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Dept</span>
                    <span className="info-value">{jobDetails.jobBasics?.department}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Location</span>
                    <span className="info-value">{jobDetails.locations?.join(", ")}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Candidate Information */}
        {jobDetails && (
          <div className="card animate-fade-in shadow-lg">
            <div className="card-header">
              <div className="flex-row">
                <div className="stat-icon" style={{ width: '32px', height: '32px', borderRadius: '8px', fontSize: '14px' }}>2</div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>Candidate Details</h3>
              </div>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input name="candidateName" placeholder="Candidate Name" value={formData.candidateName} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input name="email" type="email" placeholder="email@example.com" value={formData.email} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Mobile No.</label>
                    <input name="mobile" placeholder="10 digits" pattern="[0-9]{10}" value={formData.mobile} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Total Experience (Yrs)</label>
                    <input name="totalExperience" type="number" step="0.1" placeholder="Years" value={formData.totalExperience} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label>Designation</label>
                    <input name="currentDesignation" placeholder="e.g. Lead" value={formData.currentDesignation} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Employer</label>
                    <input name="currentOrganization" placeholder="Company Name" value={formData.currentOrganization} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label>Current CTC</label>
                    <input name="currentCTC" type="number" placeholder="INR" value={formData.currentCTC} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Expected CTC</label>
                    <input name="expectedCTC" type="number" placeholder="INR" value={formData.expectedCTC} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Skills</label>
                  <div className="flex-row" style={{ gap: '10px' }}>
                    <input type="text" placeholder="Type and press Enter" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleKeyDown} />
                    <button type="button" className="btn-primary" onClick={handleAddSkill}>Add</button>
                  </div>
                  <div className="flex-row" style={{ flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                    {skills.map(s => (
                      <span key={s} className="skill-chip">
                        {s} <FiX size={14} style={{ cursor: 'pointer', marginLeft: '6px' }} onClick={() => handleRemoveSkill(s)} />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Resume (PDF Only)</label>
                  <div style={{ border: '2px dashed var(--border)', padding: '30px', borderRadius: '12px', textAlign: 'center', position: 'relative' }}>
                    <input type="file" accept=".pdf" onChange={handleFileChange} style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer' }} />
                    <div className="flex-col" style={{ alignItems: 'center' }}>
                      <MdAttachFile size={24} className="text-muted" />
                      <span style={{ fontWeight: 600, fontSize: '14px', marginTop: '8px' }}>{selectedFile ? selectedFile.name : "Select Document"}</span>
                    </div>
                  </div>
                </div>

                <div className="card-footer" style={{ background: 'transparent', padding: '24px 0 0' }}>
                  <span className="text-xs text-muted">* Ensure details match the resume.</span>
                  <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ padding: '14px 40px' }}>
                    {isSubmitting ? "..." : "Create Referral"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateReferral;

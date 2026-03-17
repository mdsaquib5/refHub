import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJobApi } from "../../api/jobsApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const initialForm = {
    organizationName: "",
    title: "",
    department: "",
    jobCategory: "",
    jobSummary: "",
    jobDescription: "",
    locations: "",
    workType: "",
    seniorityLevel: "",
    numberOfOpenings: "",
    experienceMin: "",
    experienceMax: "",
    salaryMin: "",
    salaryMax: "",
    skillsRequired: ""
};

const CreateJob = () => {
    const [formData, setFormData] = useState(initialForm);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const createMutation = useMutation({
        mutationFn: createJobApi,
        onSuccess: () => {
            toast.success("Job created successfully 🚀");
            queryClient.invalidateQueries(["employer-jobs"]);
            navigate("/dashboard/jobs/all");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to create job");
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // validation
        for (let key in formData) {
            if (!formData[key]) {
                toast.error("Please fill all required fields");
                return;
            }
        }

        const payload = {
            organizationName: formData.organizationName,
            jobBasics: {
                title: formData.title,
                department: formData.department,
                jobCategory: formData.jobCategory
            },
            jobSummary: formData.jobSummary,
            jobDescription: formData.jobDescription,
            locations: formData.locations.split(",").map(l => l.trim()),
            workplace: {
                workType: formData.workType,
                seniorityLevel: formData.seniorityLevel,
                numberOfOpenings: Number(formData.numberOfOpenings)
            },
            experience: {
                min: Number(formData.experienceMin),
                max: Number(formData.experienceMax)
            },
            salaryRange: {
                min: Number(formData.salaryMin),
                max: Number(formData.salaryMax)
            },
            skillsRequired: formData.skillsRequired
                .split(",")
                .map(skill => skill.trim())
        };

        createMutation.mutate(payload);
    };

    return (
        <div className="create-job-container">
            <div className="create-job-card">
                <h1 className="page-title">Post a New Job</h1>
                <p className="page-subtitle">Fill in the details to create a job opening</p>

                <form className="create-job-form form-grid" onSubmit={handleSubmit}>

                    <div className="form-group full-width">
                        <label>Organization Name *</label>
                        <input
                            type="text"
                            name="organizationName"
                            placeholder="e.g., Alten India"
                            value={formData.organizationName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Job Title *</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g., Software Engineer"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Department *</label>
                        <input
                            type="text"
                            name="department"
                            placeholder="e.g., Engineering"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Job Category *</label>
                        <input
                            type="text"
                            name="jobCategory"
                            placeholder="e.g., Development"
                            value={formData.jobCategory}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Work Type *</label>
                        <select
                            name="workType"
                            value={formData.workType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Work Type</option>
                            <option value="onsite">Onsite</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="remote">Remote</option>
                        </select>
                    </div>

                    <div className="form-group full-width">
                        <label>Job Summary *</label>
                        <textarea
                            name="jobSummary"
                            placeholder="Briefly describe the role in 2-3 sentences"
                            value={formData.jobSummary}
                            onChange={handleChange}
                            rows="2"
                            required
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Job Description *</label>
                        <textarea
                            name="jobDescription"
                            placeholder="Detailed job description, responsibilities, and expectations"
                            value={formData.jobDescription}
                            onChange={handleChange}
                            rows="6"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Seniority Level *</label>
                        <select
                            name="seniorityLevel"
                            value={formData.seniorityLevel}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Level</option>
                            <option value="intern">Intern</option>
                            <option value="junior">Junior</option>
                            <option value="mid">Mid-level</option>
                            <option value="senior">Senior</option>
                            <option value="lead">Lead</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Number of Openings *</label>
                        <input
                            type="number"
                            name="numberOfOpenings"
                            min="1"
                            placeholder="e.g., 5"
                            value={formData.numberOfOpenings}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Experience Range (years) *</label>
                        <div className="range-group">
                            <input
                                type="number"
                                name="experienceMin"
                                placeholder="Min"
                                value={formData.experienceMin}
                                onChange={handleChange}
                                required
                            />
                            <span className="range-separator">-</span>
                            <input
                                type="number"
                                name="experienceMax"
                                placeholder="Max"
                                value={formData.experienceMax}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Annual Salary Range (₹) *</label>
                        <div className="range-group">
                            <input
                                type="number"
                                name="salaryMin"
                                placeholder="Min"
                                value={formData.salaryMin}
                                onChange={handleChange}
                                required
                            />
                            <span className="range-separator">-</span>
                            <input
                                type="number"
                                name="salaryMax"
                                placeholder="Max"
                                value={formData.salaryMax}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Locations (comma separated) *</label>
                        <input
                            type="text"
                            name="locations"
                            placeholder="e.g., Bangalore, Delhi, Remote"
                            value={formData.locations}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Required Skills (comma separated) *</label>
                        <textarea
                            name="skillsRequired"
                            placeholder="e.g., React, Node.js, AWS, TypeScript"
                            value={formData.skillsRequired}
                            onChange={handleChange}
                            rows="2"
                            required
                        />
                    </div>

                    <div className="form-group full-width form-actions">
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={createMutation.isPending}
                        >
                            {createMutation.isPending ? <span className="btn-loading"><span className="spinner spinner--sm"></span>Creating</span> : "Create Job Posting"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateJob;
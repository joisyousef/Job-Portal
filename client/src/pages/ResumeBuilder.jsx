import React, { useState } from "react";
import html2pdf from "html2pdf.js";

const initialState = {
  firstName: "James",
  lastName: "Potter",
  jobTitle: "Full Stack Frontend Developer",
  address: "525 N Tryon Street, NC 28117",
  phone: "9803152075",
  email: "accounts@tubeguruji.com",
  summary:
    "Highly skilled Full Stack Frontend Developer with 3+ years of experience in building and maintaining complex web applications. Proficient in React.js, JavaScript, HTML, CSS, and various backend technologies. Passionate about creating user-centric and responsive web experiences.",
  skills:
    "React.js, JavaScript, HTML, CSS, Backend Technologies, Agile Methodologies, Git, Debugging",
  experienceCompany: "Amazon",
  experienceTitle: "Full Stack Frontend Developer",
  experienceDates: "2024-06-01 To 2024-06-29",
  experienceDescription:
    "Developed and maintained complex web applications using React.js, JavaScript, HTML, CSS, and various backend technologies.\nImplemented responsive designs and user interfaces to ensure optimal user experience across different devices.\nCollaborated with designers and backend developers to translate wireframes and designs into functional web applications.\nUtilized agile methodologies to manage project timelines, prioritize tasks, and deliver high-quality code on time.\nProficient in testing and debugging web applications to ensure functionality and performance.\nExperienced in working with version control systems like Git to manage code changes and collaborate with team members.\nContinuously explored and implemented new technologies and frameworks to enhance development skills and stay updated with industry trends.",
  educationDegree: "Bachelor of Technology in Computer Science",
  educationUniversity: "University of North Carolina",
  educationYear: "2020",
};

const ResumeBuilder = () => {
  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById("resume-preview");
    const opt = {
      margin: [10, 10, 10, 10],
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(element).set(opt).save();
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e1e5e9",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
    backgroundColor: "#fafbfc",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    fontSize: "14px",
    color: "#374151",
    letterSpacing: "0.025em",
  };

  const sectionHeaderStyle = {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1f2937",
    marginTop: "32px",
    marginBottom: "16px",
    paddingBottom: "8px",
    borderBottom: "2px solid #e5e7eb",
    letterSpacing: "-0.025em",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "32px",
        padding: "24px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Left: Personal Details Form */}
      <div
        style={{
          flex: 1,
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          padding: "32px",
          border: "1px solid #f3f4f6",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "800",
              color: "#111827",
              marginBottom: "8px",
              letterSpacing: "-0.025em",
            }}
          >
            Personal Details
          </h2>
          <p
            style={{
              color: "#6b7280",
              fontSize: "16px",
              margin: "0",
              fontWeight: "400",
            }}
          >
            Get started with the basic information
          </p>
        </div>

        <div>
          <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          <h3 style={sectionHeaderStyle}>Summary</h3>
          <textarea
            name="summary"
            value={form.summary}
            onChange={handleChange}
            rows="5"
            style={{
              ...inputStyle,
              resize: "vertical",
              minHeight: "120px",
              lineHeight: "1.5",
            }}
          ></textarea>

          <h3 style={sectionHeaderStyle}>Skills</h3>
          <input
            type="text"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            style={inputStyle}
            placeholder="e.g., React.js, JavaScript, HTML, CSS"
          />

          <h3 style={sectionHeaderStyle}>Professional Experience</h3>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Company</label>
            <input
              type="text"
              name="experienceCompany"
              value={form.experienceCompany}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Job Title</label>
            <input
              type="text"
              name="experienceTitle"
              value={form.experienceTitle}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>
              Dates (e.g., 2024-06-01 To 2024-06-29)
            </label>
            <input
              type="text"
              name="experienceDates"
              value={form.experienceDates}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Description (Use \n for new lines)</label>
            <textarea
              name="experienceDescription"
              value={form.experienceDescription}
              onChange={handleChange}
              rows="7"
              style={{
                ...inputStyle,
                resize: "vertical",
                minHeight: "160px",
                lineHeight: "1.5",
              }}
            ></textarea>
          </div>

          <h3 style={sectionHeaderStyle}>Education</h3>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Degree</label>
            <input
              type="text"
              name="educationDegree"
              value={form.educationDegree}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>University</label>
            <input
              type="text"
              name="educationUniversity"
              value={form.educationUniversity}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Year</label>
            <input
              type="text"
              name="educationYear"
              value={form.educationYear}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
            <button
              type="button"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                border: "none",
                padding: "14px 28px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 14px 0 rgba(102, 126, 234, 0.39)",
              }}
            >
              Save Resume
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              style={{
                background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                color: "#fff",
                border: "none",
                padding: "14px 28px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 14px 0 rgba(17, 153, 142, 0.39)",
              }}
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Right: Resume Preview */}
      <div
        id="resume-preview"
        style={{
          flex: 1,
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          padding: "40px",
          borderTop: "6px solid #667eea",
          lineHeight: "1.7",
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          border: "1px solid #f3f4f6",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "8px",
              fontSize: "42px",
              fontWeight: "800",
              letterSpacing: "-0.025em",
            }}
          >
            {form.firstName} {form.lastName}
          </h1>
          <div
            style={{
              fontWeight: "600",
              fontSize: "20px",
              color: "#374151",
              marginBottom: "8px",
            }}
          >
            {form.jobTitle}
          </div>
          <div
            style={{
              color: "#6b7280",
              fontSize: "16px",
              fontWeight: "400",
            }}
          >
            {form.address}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "24px 0",
            paddingBottom: "24px",
            borderBottom: "2px solid #e5e7eb",
            gap: "16px",
          }}
        >
          <span
            style={{
              color: "#667eea",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            {form.phone}
          </span>
          <span
            style={{
              color: "#667eea",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            {form.email}
          </span>
        </div>

        <h3
          style={{
            color: "#1f2937",
            marginTop: "32px",
            marginBottom: "16px",
            paddingBottom: "8px",
            borderBottom: "2px solid #667eea",
            fontSize: "20px",
            fontWeight: "700",
            letterSpacing: "-0.025em",
          }}
        >
          Summary
        </h3>
        <p
          style={{
            marginTop: "0",
            color: "#374151",
            fontSize: "16px",
            lineHeight: "1.7",
          }}
        >
          {form.summary}
        </p>

        <h3
          style={{
            color: "#1f2937",
            marginTop: "32px",
            marginBottom: "16px",
            paddingBottom: "8px",
            borderBottom: "2px solid #667eea",
            fontSize: "20px",
            fontWeight: "700",
            letterSpacing: "-0.025em",
          }}
        >
          Skills
        </h3>
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {form.skills.split(",").map((skill, index) => (
            <li
              key={index}
              style={{
                background:
                  "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                border: "1px solid #e5e7eb",
              }}
            >
              {skill.trim()}
            </li>
          ))}
        </ul>

        <h3
          style={{
            color: "#1f2937",
            marginTop: "32px",
            marginBottom: "16px",
            paddingBottom: "8px",
            borderBottom: "2px solid #667eea",
            fontSize: "20px",
            fontWeight: "700",
            letterSpacing: "-0.025em",
          }}
        >
          Professional Experience
        </h3>
        <div>
          <div
            style={{
              fontWeight: "700",
              color: "#667eea",
              fontSize: "18px",
              marginBottom: "4px",
            }}
          >
            {form.experienceTitle}
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "#374151",
              marginBottom: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: "600" }}>{form.experienceCompany}</span>
            <span
              style={{
                fontStyle: "italic",
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              {form.experienceDates}
            </span>
          </div>
          <ul
            style={{
              listStyleType: "disc",
              marginLeft: "20px",
              padding: "0",
              marginTop: "8px",
            }}
          >
            {form.experienceDescription.split("\n").map((item, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "8px",
                  color: "#374151",
                  fontSize: "15px",
                  lineHeight: "1.6",
                }}
              >
                {item.trim()}
              </li>
            ))}
          </ul>
        </div>

        <h3
          style={{
            color: "#1f2937",
            marginTop: "32px",
            marginBottom: "16px",
            paddingBottom: "8px",
            borderBottom: "2px solid #667eea",
            fontSize: "20px",
            fontWeight: "700",
            letterSpacing: "-0.025em",
          }}
        >
          Education
        </h3>
        <div>
          <div
            style={{
              fontWeight: "700",
              color: "#667eea",
              fontSize: "18px",
              marginBottom: "4px",
            }}
          >
            {form.educationDegree}
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "#374151",
              fontWeight: "500",
            }}
          >
            {form.educationUniversity}, {form.educationYear}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;

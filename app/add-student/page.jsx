"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddStudent() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    gender: "",
    fatherName: "",
    motherName: "",
    fatherEmail: "",
    motherEmail: "",
    fatherNumber: "",
    motherNumber: "",
    class10thMarks: "",
    class12thMarks: "",
    class10thMarksPdf: null,
    class12thMarksPdf: null,
    class10thSchoolName: "",
    class12thSchoolName: "",
    modeOfAdmission: "",
    caste: "",
    casteCertificate: null,
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      setError("");
    }
  };

  const validateStep1 = () => {
    const requiredFields = [
      "name",
      "email",
      "phoneNumber",
      "address",
      "gender",
      "fatherName",
      "motherName",
      "class10thMarks",
      "class12thMarks",
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep2()) {
      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key]);
      }

      try {
        const res = await fetch("/api/add-student", {
          method: "POST",
          body: data,
        });
        const result = await res.json();
        if (res.ok) {
          alert("Student added successfully!");
          router.push("/view-student");
        } else {
          setError(result.error || "Failed to add student");
        }
      } catch (error) {
        setError("An error occurred");
        console.error(error);
      }
    }
  };

  const validateStep2 = () => {
    const requiredFields = ["class10thSchoolName", "class12thSchoolName", "modeOfAdmission", "caste"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Add Student</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-4 max-w-2xl mx-auto">
        {step === 1 && (
          <>
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Gender</label>
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Father's Name</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Mother's Name</label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Father's Email</label>
              <input
                type="email"
                name="fatherEmail"
                value={formData.fatherEmail}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Mother's Email</label>
              <input
                type="email"
                name="motherEmail"
                value={formData.motherEmail}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Father's Number</label>
              <input
                type="text"
                name="fatherNumber"
                value={formData.fatherNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Mother's Number</label>
              <input
                type="text"
                name="motherNumber"
                value={formData.motherNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Class 10th Marks</label>
              <input
                type="number"
                step="0.01"
                name="class10thMarks"
                value={formData.class10thMarks}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Class 12th Marks</label>
              <input
                type="number"
                step="0.01"
                name="class12thMarks"
                value={formData.class12thMarks}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Class 10th Marks PDF</label>
              <input
                type="file"
                name="class10thMarksPdf"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Class 12th Marks PDF</label>
              <input
                type="file"
                name="class12thMarksPdf"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Next
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <div>
              <label className="block text-gray-700">Class 10th School Name</label>
              <input
                type="text"
                name="class10thSchoolName"
                value={formData.class10thSchoolName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Class 12th School Name</label>
              <input
                type="text"
                name="class12thSchoolName"
                value={formData.class12thSchoolName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Mode of Admission</label>
              <input
                type="text"
                name="modeOfAdmission"
                value={formData.modeOfAdmission}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Caste</label>
              <input
                type="text"
                name="caste"
                value={formData.caste}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Caste Certificate (Optional)</label>
              <input
                type="file"
                name="casteCertificate"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </>
        )}
        {step === 2 && (
          <button
            type="button"
            onClick={() => {
              setStep(1);
              setError("");
            }}
            className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mt-4"
          >
            Back
          </button>
        )}
      </form>
    </div>
  );
}
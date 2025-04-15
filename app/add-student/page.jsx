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
    photo: null,
  });
  const [error, setError] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
      if (name === "photo" && file) {
        setPhotoPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
    const requiredFields = [
      "class10thSchoolName",
      "class12thSchoolName",
      "modeOfAdmission",
      "caste",
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Add New Student</h1>
            <p className="text-gray-600">Step {step} of 2</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Father's Name</label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Father's Email</label>
                  <input
                    type="email"
                    name="fatherEmail"
                    value={formData.fatherEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Mother's Email</label>
                  <input
                    type="email"
                    name="motherEmail"
                    value={formData.motherEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Father's Number</label>
                  <input
                    type="text"
                    name="fatherNumber"
                    value={formData.fatherNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Mother's Number</label>
                  <input
                    type="text"
                    name="motherNumber"
                    value={formData.motherNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Class 10th Marks</label>
                  <input
                    type="number"
                    step="0.01"
                    name="class10thMarks"
                    value={formData.class10thMarks}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Class 12th Marks</label>
                  <input
                    type="number"
                    step="0.01"
                    name="class12thMarks"
                    value={formData.class12thMarks}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Class 10th Marks PDF</label>
                  <input
                    type="file"
                    name="class10thMarksPdf"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Class 12th Marks PDF</label>
                  <input
                    type="file"
                    name="class12thMarksPdf"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Student Photo</label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {photoPreview && (
                    <div className="mt-2">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Class 10th School Name</label>
                  <input
                    type="text"
                    name="class10thSchoolName"
                    value={formData.class10thSchoolName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Class 12th School Name</label>
                  <input
                    type="text"
                    name="class12thSchoolName"
                    value={formData.class12thSchoolName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Mode of Admission</label>
                  <select
                    name="modeOfAdmission"
                    value={formData.modeOfAdmission}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Mode of Admission</option>
                    <option value="KCET">KCET</option>
                    <option value="COMEDK">COMEDK</option>
                    <option value="MANAGEMENT">MANAGEMENT</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Caste</label>
                  <input
                    type="text"
                    name="caste"
                    value={formData.caste}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Caste Certificate</label>
                  <input
                    type="file"
                    name="casteCertificate"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError("");
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {step === 1 ? "Next" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

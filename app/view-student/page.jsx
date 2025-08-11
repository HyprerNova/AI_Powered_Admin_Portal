// "use client";
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export default async function ViewStudent() {
//   const session = await getServerSession();
//   if (!session) {
//     redirect("/login");
//   }

//   const students = await prisma.student.findMany({
//     orderBy: { id: "desc" },
//   });

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Student Records</h1>
//           <p className="mt-2 text-sm text-gray-600">
//             View and manage student information
//           </p>
//         </div>

//         {students.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-sm p-8 text-center">
//             <div className="max-w-md mx-auto">
//               <svg
//                 className="mx-auto h-12 w-12 text-gray-400"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 aria-hidden="true"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                 />
//               </svg>
//               <h3 className="mt-2 text-sm font-medium text-gray-900">
//                 No students found
//               </h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 Get started by adding a new student.
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       ID
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Name
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Email
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Phone
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Address
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Gender
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Father's Name
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Mother's Name
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Father's Email
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Mother's Email
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Father's Number
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Mother's Number
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       10th Marks
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       12th Marks
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       10th Marks PDF
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       12th Marks PDF
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Photo
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       10th School
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       12th School
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Admission Mode
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Caste
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Caste Certificate
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Created At
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 z-10">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {students.map((student) => (
//                     <tr
//                       key={student.id}
//                       className="hover:bg-gray-50 transition-colors duration-150"
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {student.id}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {student.name}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.email}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.phoneNumber}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.address}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.gender}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.fatherName}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.motherName}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.fatherEmail || "N/A"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.motherEmail || "N/A"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.fatherNumber || "N/A"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.motherNumber || "N/A"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.class10thMarks}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.class12thMarks}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.class10thMarksPdf ? (
//                           <a
//                             href={student.class10thMarksPdf}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
//                           >
//                             View File
//                           </a>
//                         ) : (
//                           "N/A"
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.class12thMarksPdf ? (
//                           <a
//                             href={student.class12thMarksPdf}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
//                           >
//                             View File
//                           </a>
//                         ) : (
//                           "N/A"
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.photo ? (
//                           <a
//                             href={student.photo}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             <img
//                               src={student.photo}
//                               alt={`${student.name}'s photo`}
//                               className="h-16 w-16 object-cover rounded-full border hover:opacity-80 transition"
//                             />
//                           </a>
//                         ) : (
//                           "N/A"
//                         )}
//                       </td>

//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.class10thSchoolName}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.class12thSchoolName}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.modeOfAdmission}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.caste}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.casteCertificate ? (
//                           <a
//                             href={student.casteCertificate}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
//                           >
//                             View File
//                           </a>
//                         ) : (
//                           "N/A"
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.createdAt?.toLocaleDateString() || "N/A"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 sticky right-0 bg-white z-10">
//                         <div className="flex items-center space-x-2">
//                           <form
//                             action={`/api/delete-student?id=${student.id}`}
//                             method="POST"
//                           >
//                             <button
//                               type="submit"
//                               className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
//                               onClick={(e) => {
//                                 if (
//                                   !confirm(
//                                     "Are you sure you want to delete this student?"
//                                   )
//                                 ) {
//                                   e.preventDefault();
//                                 }
//                               }}
//                             >
//                               <svg
//                                 className="h-4 w-4 mr-1.5"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 stroke="currentColor"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                                 />
//                               </svg>
//                               Delete
//                             </button>
//                           </form>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// "use client"; // This is the most important change

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation"; // Use for session checks on client

// export default function ViewStudentPage() {
//   const [students, setStudents] = useState([]);
//   const [initialStudents, setInitialStudents] = useState([]); // To store the full list
//   const [query, setQuery] = useState("");
//   const [isLoading, setIsLoading] = useState(true); // Start loading initially
//   const [error, setError] = useState("");
//   const router = useRouter();

//   // Fetch initial data when the component mounts
//   useEffect(() => {
//     // In a real app with NextAuth.js, you'd use the useSession hook here
//     // For now, we'll fetch the data directly.
//     const fetchInitialData = async () => {
//       setIsLoading(true);
//       try {
//         // We now call the API route to get students
//         const res = await fetch('/api/get-students'); // Assuming you have this API route
//         if (!res.ok) throw new Error("Failed to fetch students");
//         const data = await res.json();
//         setStudents(data);
//         setInitialStudents(data); // Save the original list
//       } catch (err) {
//         setError("Could not load student data.");
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchInitialData();
//   }, []);


//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       const res = await fetch("/api/search-students", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ query }),
//       });

//       if (!res.ok) {
//         const result = await res.json();
//         throw new Error(result.error || "Search request failed");
//       }
//       const data = await res.json();
//       setStudents(data);
//     } catch (err) {
//       setError(`Could not fetch results: ${err.message}`);
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetSearch = () => {
//     setQuery("");
//     setStudents(initialStudents); // Reset to the full list
//     setError("");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Student Records</h1>
//           <p className="mt-2 text-sm text-gray-600">
//             Use the search bar below to find students using natural language.
//           </p>
//         </div>

//         {/* Search Bar */}
//         <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
//           <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
//             <input
//               type="text"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="e.g., students from Bengaluru with 12th marks above 85"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//               disabled={isLoading}
//             />
//             <div className="flex gap-2">
//               <button
//                 type="submit"
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Searching..." : "Search"}
//               </button>
//               <button
//                 type="button"
//                 onClick={resetSearch}
//                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//                 disabled={isLoading}
//               >
//                 Reset
//               </button>
//             </div>
//           </form>
//           {error && <p className="text-red-500 mt-2">{error}</p>}
//         </div>

//         {/* Table / Loading / Empty State */}
//         {isLoading && !error ? (
//            <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">Loading student data...</div>
//         ) : students.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-sm p-8 text-center">
//              <div className="max-w-md mx-auto">
//                 <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
//                 <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
//                 <p className="mt-1 text-sm text-gray-500">No students matched your criteria, or no students have been added yet.</p>
//              </div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               {/* Note: The full table from your original code would go here */}
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">12th Marks</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission Mode</th>
//                     {/* Add other headers from your original code as needed */}
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {students.map((student) => (
//                     <tr key={student.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.address}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class12thMarks}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.modeOfAdmission}</td>
//                        {/* You can add the delete button and other columns here */}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client"; // This is the most important change

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use for session checks on client

export default function ViewStudentPage() {
  const [students, setStudents] = useState([]);
  const [initialStudents, setInitialStudents] = useState([]); // To store the full list
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Start loading initially
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch initial data when the component mounts
  useEffect(() => {
    // In a real app with NextAuth.js, you'd use the useSession hook here
    // For now, we'll fetch the data directly.
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // We now call the API route to get students
        const res = await fetch("/api/get-students"); // Assuming you have this API route
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        setStudents(data);
        setInitialStudents(data); // Save the original list
      } catch (err) {
        setError("Could not load student data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/search-students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Search request failed");
      }
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      setError(`Could not fetch results: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSearch = () => {
    setQuery("");
    setStudents(initialStudents); // Reset to the full list
    setError("");
  };

  // Function to handle student deletion
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      const res = await fetch(`/api/delete-student?id=${id}`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to delete student");
      }

      // Filter out the deleted student from the current state
      setStudents(students.filter((student) => student.id !== id));
      setInitialStudents(initialStudents.filter((student) => student.id !== id));
      alert("Student deleted successfully!");
    } catch (err) {
      alert(`Error deleting student: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Records</h1>
          <p className="mt-2 text-sm text-gray-600">
            Use the search bar below to find students using natural language.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., students from Bengaluru with 12th marks above 85"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                disabled={isLoading}
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
              <button
                type="button"
                onClick={resetSearch}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                disabled={isLoading}
              >
                Reset
              </button>
            </div>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* Table / Loading / Empty State */}
        {isLoading && !error ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
            Loading student data...
          </div>
        ) : students.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No students found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                No students matched your criteria, or no students have been
                added yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Father's Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mother's Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Father's Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mother's Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Father's Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mother's Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      10th Marks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      12th Marks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      10th Marks PDF
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      12th Marks PDF
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Photo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      10th School
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      12th School
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admission Mode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Caste
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Caste Certificate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 z-10">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.phoneNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.fatherName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.motherName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.fatherEmail || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.motherEmail || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.fatherNumber || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.motherNumber || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.class10thMarks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.class12thMarks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.class10thMarksPdf ? (
                          <a
                            href={student.class10thMarksPdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                          >
                            View File
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.class12thMarksPdf ? (
                          <a
                            href={student.class12thMarksPdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                          >
                            View File
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.photo ? (
                          <a
                            href={student.photo}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={student.photo}
                              alt={`${student.name}'s photo`}
                              className="h-16 w-16 object-cover rounded-full border hover:opacity-80 transition"
                            />
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.class10thSchoolName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.class12thSchoolName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.modeOfAdmission}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.caste}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.casteCertificate ? (
                          <a
                            href={student.casteCertificate}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                          >
                            View File
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(student.createdAt).toLocaleDateString() ||
                          "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 sticky right-0 bg-white z-10">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDelete(student.id)}
                            type="button"
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                          >
                            <svg
                              className="h-4 w-4 mr-1.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function ViewStudent() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const students = await prisma.student.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">View Students</h1>
      {students.length === 0 ? (
        <p className="text-gray-600">No students found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Gender</th>
                <th className="border p-2">Father's Name</th>
                <th className="border p-2">Mother's Name</th>
                <th className="border p-2">Father's Email</th>
                <th className="border p-2">Mother's Email</th>
                <th className="border p-2">Father's Number</th>
                <th className="border p-2">Mother's Number</th>
                <th className="border p-2">10th Marks</th>
                <th className="border p-2">12th Marks</th>
                <th className="border p-2">10th Marks PDF</th>
                <th className="border p-2">12th Marks PDF</th>
                <th className="border p-2">Photo</th>
                <th className="border p-2">10th School</th>
                <th className="border p-2">12th School</th>
                <th className="border p-2">Admission Mode</th>
                <th className="border p-2">Caste</th>
                <th className="border p-2">Caste Certificate</th>
                <th className="border p-2">Created At</th> {/* New column */}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border">
                  <td className="border p-2">{student.id}</td>
                  <td className="border p-2">{student.name}</td>
                  <td className="border p-2">{student.email}</td>
                  <td className="border p-2">{student.phoneNumber}</td>
                  <td className="border p-2">{student.address}</td>
                  <td className="border p-2">{student.gender}</td>
                  <td className="border p-2">{student.fatherName}</td>
                  <td className="border p-2">{student.motherName}</td>
                  <td className="border p-2">{student.fatherEmail || "N/A"}</td>
                  <td className="border p-2">{student.motherEmail || "N/A"}</td>
                  <td className="border p-2">{student.fatherNumber || "N/A"}</td>
                  <td className="border p-2">{student.motherNumber || "N/A"}</td>
                  <td className="border p-2">{student.class10thMarks}</td>
                  <td className="border p-2">{student.class12thMarks}</td>
                  <td className="border p-2">
                    {student.class10thMarksPdf ? (
                      <a
                        href={student.class10thMarksPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View File
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="border p-2">
                    {student.class12thMarksPdf ? (
                      <a
                        href={student.class12thMarksPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View File
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="border p-2">
                    {student.photo ? (
                      <a
                        href={student.photo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Photo
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="border p-2">{student.class10thSchoolName}</td>
                  <td className="border p-2">{student.class12thSchoolName}</td>
                  <td className="border p-2">{student.modeOfAdmission}</td>
                  <td className="border p-2">{student.caste}</td>
                  <td className="border p-2">
                    {student.casteCertificate ? (
                      <a
                        href={student.casteCertificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View File
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="border p-2">{student.createdAt?.toISOString() || "N/A"}</td> {/* New column data */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
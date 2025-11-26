import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { query } from "@/lib/pool"; // Import your custom query function

export default async function EditStudent({ searchParams }) {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const searchParamsObj = await searchParams;
  const id = searchParamsObj?.id ? parseInt(searchParamsObj.id) : null;
  if (!id) {
    redirect("/view-student");
  }

  const studentResult = await query(`SELECT * FROM student WHERE id = $1`, [
    id,
  ]);
  const student = studentResult.rows[0];

  if (!student) {
    redirect("/view-student");
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Student</h1>
          <p className="text-gray-600">Modify student information</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form action="/api/edit-student" method="POST" className="space-y-4">
            <input type="hidden" name="id" value={student.id} />
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                defaultValue={student.name}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                defaultValue={student.email}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                defaultValue={student.phoneNumber}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                defaultValue={student.address}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Gender</label>
              <input
                type="text"
                name="gender"
                defaultValue={student.gender}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Father's Name</label>
              <input
                type="text"
                name="fatherName"
                defaultValue={student.fatherName}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Mother's Name</label>
              <input
                type="text"
                name="motherName"
                defaultValue={student.motherName}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Father's Email</label>
              <input
                type="email"
                name="fatherEmail"
                defaultValue={student.fatherEmail || ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Mother's Email</label>
              <input
                type="email"
                name="motherEmail"
                defaultValue={student.motherEmail || ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Father's Number</label>
              <input
                type="text"
                name="fatherNumber"
                defaultValue={student.fatherNumber || ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Mother's Number</label>
              <input
                type="text"
                name="motherNumber"
                defaultValue={student.motherNumber || ""}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Class 10th Marks</label>
              <input
                type="number"
                step="0.01"
                name="class10thMarks"
                defaultValue={student.class10thMarks}
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
                defaultValue={student.class12thMarks}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">
                Class 10th School Name
              </label>
              <input
                type="text"
                name="class10thSchoolName"
                defaultValue={student.class10thSchoolName}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">
                Class 12th School Name
              </label>
              <input
                type="text"
                name="class12thSchoolName"
                defaultValue={student.class12thSchoolName}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Mode of Admission</label>
              <select
                name="modeOfAdmission"
                defaultValue={student.modeOfAdmission}
                className="w-full p-2 border rounded"
                required
              >
                <option value="KCET">KCET</option>
                <option value="COMEDK">COMEDK</option>
                <option value="MANAGEMENT">MANAGEMENT</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Caste</label>
              <input
                type="text"
                name="caste"
                defaultValue={student.caste}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
              <a
                href="/view-student"
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-center inline-block"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

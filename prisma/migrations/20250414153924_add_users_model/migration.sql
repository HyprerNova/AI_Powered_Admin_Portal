-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "fatherEmail" TEXT,
    "motherEmail" TEXT,
    "fatherNumber" TEXT,
    "motherNumber" TEXT,
    "class10thMarks" DOUBLE PRECISION NOT NULL,
    "class12thMarks" DOUBLE PRECISION NOT NULL,
    "class10thMarksPdf" TEXT NOT NULL,
    "class12thMarksPdf" TEXT NOT NULL,
    "class10thSchoolName" TEXT NOT NULL,
    "class12thSchoolName" TEXT NOT NULL,
    "modeOfAdmission" TEXT NOT NULL,
    "caste" TEXT NOT NULL,
    "casteCertificate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

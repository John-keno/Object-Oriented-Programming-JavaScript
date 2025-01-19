import inquirer from "inquirer";

class Hospital {
  static totalHospitals = 0;
  constructor(name, address) {
    this.name = name;
    this.address = address;
    this.departments = [];
    Hospital.totalHospitals++;
  }

  static createHospital(name, address) {
    return new Hospital(name, address);
  }

  addDepartment(department) {
    this.departments.push(department);
  }

  removeDepartment(departmentId) {
    this.departments = this.departments.filter(
      (department) => department.departmentId !== departmentId
    );
  }

  findDepartment(departmentId) {
    return this.departments.find(
      (department) => department.departmentId === departmentId
    );
  }
}

class Department {
  static totalDepartments = 0;
  constructor(departmentId, name) {
    this.departmentId = departmentId;
    this.name = name;
    this.doctors = [];
    Department.totalDepartments++;
  }

  static createDepartment(departmentId, name) {
    return new Department(departmentId, name);
  }

  addDoctor(doctor) {
    this.doctors.push(doctor);
  }

  removeDoctor(doctorId) {
    this.doctors = this.doctors.filter(
      (doctor) => doctor.doctorId !== doctorId
    );
  }

  findDoctor(doctorId) {
    return this.doctors.find((doctor) => doctor.doctorId === doctorId);
  }
}

class Doctor {
  static totalDoctors = 0;
  constructor(doctorId, name, specialty) {
    this.doctorId = doctorId;
    this.name = name;
    this.specialty = specialty;
    this.patients = [];
    Doctor.totalDoctors++;
  }

  static createDoctor(doctorId, name, specialty) {
    return new Doctor(doctorId, name, specialty);
  }

  diagnosePatient(patient, diagnosis) {
    console.log(
      `${this.name} diagnosed patient ${patient.name} with ${diagnosis}.`
    );
  }

  prescribeMedication(patient, medication) {
    console.log(
      `${this.name} prescribed ${medication.name} to patient ${patient.name}.`
    );
  }

  addPatient(patient) {
    this.patients.push(patient);
  }
}

class Patient {
  static totalPatients = 0;
  constructor(patientId, name, ailment) {
    this.patientId = patientId;
    this.name = name;
    this.ailment = ailment;
    this.appointments = [];
    Patient.totalPatients++;
  }

  static createPatient(patientId, name, ailment) {
    return new Patient(patientId, name, ailment);
  }

  register() {
    console.log(`Patient ${this.name} registered.`);
  }

  requestAppointment(doctor) {
    const appointment = new Appointment(Date.now(), new Date(), doctor, this);
    this.appointments.push(appointment);
    doctor.addPatient(this);
    console.log(
      `Appointment requested by patient ${this.name} with doctor ${doctor.name}.`
    );
  }
}

class Appointment {
  static totalAppointments = 0;
  constructor(appointmentId, date, doctor, patient) {
    this.appointmentId = appointmentId;
    this.date = date;
    this.doctor = doctor;
    this.patient = patient;
    Appointment.totalAppointments++;
  }

  scheduleAppointment() {
    console.log(
      `Appointment scheduled for patient ${this.patient.name} with doctor ${this.doctor.name} on ${this.date}.`
    );
  }

  cancelAppointment() {
    console.log(
      `Appointment for patient ${this.patient.name} with doctor ${this.doctor.name} has been cancelled.`
    );
  }
}

class Medication {
  static totalMedications = 0;
  constructor(medicationId, name, dosage) {
    this.medicationId = medicationId;
    this.name = name;
    this.dosage = dosage;
    Medication.totalMedications++;
  }
  static createMedication(medicationId, name, dosage) {
    return new Medication(medicationId, name, dosage);
  }
  administerMedication() {
    console.log(`Administered ${this.dosage} of ${this.name}.`);
  }
}

// Demonstration values of the Hospital Management System
const hospital = Hospital.createHospital("Jkode Hospital", "2 kode Street");
const cardiology = Department.createDepartment(1, "Cardiology");
const doc_keno = Doctor.createDoctor(1, "Dr. Keno", "Cardiologist");
const ailment = "Heart Disease";
const medication = Medication.createMedication(1, "Aspirin", "100mg");
let patient = null;
hospital.addDepartment(cardiology);
cardiology.addDoctor(doc_keno);

function promtMainActions() {
  return inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "Register Patient",
        "Request/Attend Appointment",
        "View Appointments",
        "Exit",
      ],
    },
  ]);
}

function promptPatientInfo() {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Patient Name:",
    },
  ]);
}

function promptDoctorInfo() {
  return inquirer.prompt([
    {
      type: "list",
      name: "departmentName",
      message: "Select department:",
      choices: hospital.departments.map((dep) => dep.name),
    },
    {
      type: "list",
      name: "doctorId",
      message: "Select Doctor:",
      choices: cardiology.doctors.map((doc) => doc.doctorId),
    },
  ]);
}

function promptAppointmentActions() {
  return inquirer.prompt([
    {
      type: "confirm",
      name: "isScheduled",
      message: "It is Time. Do you want to attend the scheduled appointment?",
    },
  ]);
}
async function mainMenu() {
  console.log(
    `\nWelcome to the Hospital Management System!" \n Total Available hospital => ${Hospital.totalHospitals}`
  );
  const { action } = await promtMainActions();

  switch (action) {
    case "Register Patient":
      const { name } = await promptPatientInfo();
      patient = Patient.createPatient(1, name, ailment);
      patient.register();
      mainMenu();
      break;
    case "Request/Attend Appointment":
      const { doctorId } = await promptDoctorInfo();
      const doctor = cardiology.findDoctor(doctorId);
      if (!doctor) {
        console.log("Doctor not found.");
        mainMenu();
        break;
      }
      if (patient) {
        patient.requestAppointment(doctor);
        patient.appointments[0].scheduleAppointment();
        const { isScheduled } = await promptAppointmentActions();
        if (isScheduled) {
          doctor.diagnosePatient(patient, patient.ailment);
          doctor.prescribeMedication(patient, medication);
        } else {
          patient.appointments[0].cancelAppointment();
        }
      }
      mainMenu();
      break;
    case "View Appointments":
      if (patient) {
        console.log("Patient Appointments:");
        patient.appointments.forEach((appointment) => {
          console.log(`- ${appointment.date} with ${appointment.doctor.name}`);
        });
      } else {
        console.log("No appointments available.");
      }
      mainMenu();
      break;
    case "Exit":
      console.log("Goodbye!");
      console.log(`Total Hospitals: ${Hospital.totalHospitals}`);
      console.log(`Total Departments: ${Department.totalDepartments}`);
      console.log(`Total Doctors: ${Doctor.totalDoctors}`);
      console.log(`Total Patients: ${Patient.totalPatients}`);
      console.log(`Total Appointments: ${Appointment.totalAppointments}`);
      console.log(`Total Medications: ${Medication.totalMedications}`);
      return;
  }
}

mainMenu();

import inquirer from "inquirer";

class Hospital {
  constructor(name, address) {
    this.name = name;
    this.address = address;
    this.departments = [];
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
  constructor(departmentId, name) {
    this.departmentId = departmentId;
    this.name = name;
    this.doctors = [];
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
  constructor(doctorId, name, specialty) {
    this.doctorId = doctorId;
    this.name = name;
    this.specialty = specialty;
    this.patients = [];
  }

  diagnosePatient(patient, diagnosis) {
    console.log(
      `Doctor ${this.name} diagnosed patient ${patient.name} with ${diagnosis}.`
    );
  }

  prescribeMedication(patient, medication) {
    console.log(
      `Doctor ${this.name} prescribed ${medication.name} to patient ${patient.name}.`
    );
  }

  addPatient(patient) {
    this.patients.push(patient);
  }
}

class Patient {
  constructor(patientId, name, ailment) {
    this.patientId = patientId;
    this.name = name;
    this.ailment = ailment;
    this.appointments = [];
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
  constructor(appointmentId, date, doctor, patient) {
    this.appointmentId = appointmentId;
    this.date = date;
    this.doctor = doctor;
    this.patient = patient;
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
  constructor(medicationId, name, dosage) {
    this.medicationId = medicationId;
    this.name = name;
    this.dosage = dosage;
  }

  administerMedication() {
    console.log(`Administered ${this.dosage} of ${this.name}.`);
  }
}

// Demonstration values of the Hospital Management System
const hospital = new Hospital("Jkode Hospital", "2 kode Street");
const cardiology = new Department(1, "Cardiology");
const doc_keno = new Doctor(1, "Dr. Keno", "Cardiologist");
const ailment = "Heart Disease";
const medication = new Medication(1, "Aspirin", "100mg");
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
  const { action } = await promtMainActions();

  switch (action) {
    case "Register Patient":
      const { name } = await promptPatientInfo();
      patient = new Patient(1, name, ailment);
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
  }
}

mainMenu();

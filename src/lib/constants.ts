// All data in this file is DUMMY data for the prototype.

export const HOSPITAL = {
  name: "Demo Hospital Graz",
  address: "Musterstraße 1, 8010 Graz",
  phone: "+43 316 123456",
};

export const ALTERNATIVE_LOCATION = {
  name: "Demo Clinic Graz-Süd",
  address: "Beispielgasse 12, 8020 Graz",
  phone: "+43 316 654321",
};

export const EMERGENCY_NUMBER = "144";

/** PROTOTYPE ONLY. Replaced by Keycloak (OIDC) once the backend exists. */
export const PROTOTYPE_STAFF = {
  email: "staff@gmail.com",
  password: "123456789",
};

export function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

export type TravelModeId = "car" | "taxi" | "transit" | "bike" | "walk";

export interface TravelMode {
  id: TravelModeId;
  label: string;
  hint: string;
  /** [min, max] dummy travel minutes */
  range: [number, number];
}

export const TRAVEL_MODES: TravelMode[] = [
  { id: "car", label: "Car", hint: "Your own car", range: [12, 20] },
  { id: "taxi", label: "Taxi", hint: "Taxi or ride service", range: [14, 23] },
  { id: "transit", label: "Bus & metro", hint: "Public transport", range: [25, 40] },
  { id: "bike", label: "Bike", hint: "Bicycle", range: [18, 26] },
  { id: "walk", label: "On foot", hint: "Walking", range: [55, 75] },
];

export type DoctorId = "general" | "critical" | "female";

export interface Doctor {
  id: DoctorId;
  name: string;
  role: string;
  description: string;
  /** [min, max] dummy queue minutes */
  queueRange: [number, number];
}

export const DOCTORS: Doctor[] = [
  {
    id: "general",
    name: "Dr. Markus Huber",
    role: "General medicine",
    description: "Treats most everyday conditions",
    queueRange: [10, 45],
  },
  {
    id: "critical",
    name: "Dr. Stefan Gruber",
    role: "Critical care",
    description: "Treats serious and urgent conditions",
    queueRange: [2, 12],
  },
  {
    id: "female",
    name: "Dr. Anna Weiss",
    role: "Female doctor, general medicine",
    description: "For patients who prefer a woman doctor",
    queueRange: [10, 40],
  },
];

/** Pre-selected doctor, but only while he is not busy. */
export const DEFAULT_DOCTOR_ID: DoctorId = "general";

export interface Symptom {
  id: string;
  label: string;
  /** Doctors who can treat this symptom */
  doctors: DoctorId[];
  urgent?: boolean;
}

export const SYMPTOMS: Symptom[] = [
  { id: "fever", label: "Fever or flu symptoms", doctors: ["general", "female"] },
  { id: "cough", label: "Cough or cold", doctors: ["general", "female"] },
  { id: "stomach", label: "Stomach pain or nausea", doctors: ["general", "female"] },
  { id: "injury", label: "Minor injury or sprain", doctors: ["general", "female"] },
  { id: "skin", label: "Skin rash", doctors: ["general", "female"] },
  { id: "womens", label: "Women's health", doctors: ["female"] },
  { id: "chest", label: "Chest pain or trouble breathing", doctors: ["critical"], urgent: true },
  { id: "bleeding", label: "Heavy bleeding or serious injury", doctors: ["critical"], urgent: true },
  { id: "stroke", label: "Face drooping, weak arm, slurred speech", doctors: ["critical"], urgent: true },
];

export interface Visit {
  date: string;
  reason: string;
}

export interface Appointment {
  type: string;
  date: string;
}

export interface ItemBought {
  item: string;
  date: string;
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  lastVisitDate: string;
  visits: Visit[];
  appointments: Appointment[];
  itemsBought: ItemBought[];
  occupation: string;
  address: string;
  height: string;
  weight: string;
  activeAppointments: Appointment[];
}

export const patients: Patient[] = [
  {
    id: 1,
    name: "John Doe",
    age: 45,
    lastVisitDate: "2024-05-21",
    visits: [
      { date: "2023-01-10", reason: "Routine Checkup" },
      { date: "2024-05-21", reason: "Eye Pain" }
    ],
    appointments: [
      { id: "1", doctor: "dr mr man", time: "10:00 am", fee:"2000", status: "paid" , date: "2024-06-01" },
      { id: "2", doctor: "dr mr boy", time: "10:00 pm", fee:"2000", status: "paid" , date: "2024-06-01" }
    ],
    itemsBought: [
      { item: "Glasses", date: "2024-05-21" },
      { item: "Eye Drops", date: "2024-06-01" }
    ],
    occupation: "Engineer",
    address: "123 Elm Street",
    height: "6ft",
    weight: "180 lbs",
    activeAppointments: [
      { type: "Consultation", date: "2024-06-01" }
    ]
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 32,
    lastVisitDate: "2024-04-18",
    visits: [
      { date: "2023-03-15", reason: "Blurry Vision" },
      { date: "2024-04-18", reason: "Follow-up" }
    ],
    appointments: [
      { type: "Consultation", date: "2024-05-20" },
      { type: "Surgery", date: "2024-06-25" }
    ],
    itemsBought: [
      { item: "Contact Lenses", date: "2024-04-18" },
      { item: "Sunglasses", date: "2024-05-20" }
    ],
    occupation: "Teacher",
    address: "456 Maple Avenue",
    height: "5ft 5in",
    weight: "140 lbs",
    activeAppointments: [
      { type: "Surgery", date: "2024-06-25" }
    ]
  },
  // Add more patients as needed
];

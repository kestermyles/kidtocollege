import { Metadata } from "next"
import MyChancesClient from "./MyChancesClient"

export const metadata: Metadata = {
  title: "My Chances – Admission Predictor | KidToCollege",
  description: "Enter your GPA, SAT/ACT score, state, and intended major to get an AI-powered estimate of your admission chances at your saved colleges.",
}

export default function MyChancesPage() {
  return <MyChancesClient />
}

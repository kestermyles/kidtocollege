import { Metadata } from "next"
import MyChancesClient from "./MyChancesClient"

export const metadata: Metadata = {
  title: "College Admission Chances Calculator — Will You Get In? | KidToCollege",
  description: "Enter your GPA, SAT/ACT scores, and activities. Our free AI predictor shows your real admission chances at any US college — no sign-up required.",
}

export default function MyChancesPage() {
  return <MyChancesClient />
}

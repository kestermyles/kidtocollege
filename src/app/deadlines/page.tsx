import { Metadata } from "next";
import DeadlinesClient from "./DeadlinesClient";

export const metadata: Metadata = {
  title: "College Application Deadlines 2025–26: Top 50 Schools | KidToCollege",
  description: "Never miss a deadline. Track Early Decision, Early Action, Regular Decision, and financial aid deadlines for the top 50 US colleges in one free tracker.",
};

export default function DeadlinesPage() {
  return <DeadlinesClient />;
}

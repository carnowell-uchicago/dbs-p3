import type { Metadata } from "next";
import { PeopleView } from "./PeopleView";

export const metadata: Metadata = { title: "Your people" };

export default function PeoplePage() {
  return <PeopleView />;
}

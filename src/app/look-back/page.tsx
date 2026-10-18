import type { Metadata } from "next";
import { LookBackView } from "./LookBackView";

export const metadata: Metadata = { title: "Look back" };

export default function LookBackPage() {
  return <LookBackView />;
}

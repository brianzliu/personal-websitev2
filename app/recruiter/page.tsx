import type { Metadata } from "next";
import ChatHome from "../components/chat/ChatHome";

// The link handed to recruiters (e.g. at the UCSD career fair): opens straight into the chat with a thank-you.
export const metadata: Metadata = {
  title: "Thanks for chatting | Brian Liu",
  description: "Thanks for chatting with me at the UCSD career fair. Ask the AI version of me anything, or look around.",
  robots: { index: false },
};

export default function RecruiterPage() {
  return <ChatHome recruiter />;
}

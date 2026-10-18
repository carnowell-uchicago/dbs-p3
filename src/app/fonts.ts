import { Lora, Patrick_Hand, Pixelify_Sans } from "next/font/google";

// Pixelify Sans for names, titles, and short labels; Lora for sentences;
// Patrick Hand for what's written on a postcard.
const display = Pixelify_Sans({ subsets: ["latin"], variable: "--cp-display" });
const body = Lora({ subsets: ["latin"], variable: "--cp-body" });
const hand = Patrick_Hand({ subsets: ["latin"], weight: "400", variable: "--cp-hand" });

export const fontVars = `${display.variable} ${body.variable} ${hand.variable}`;

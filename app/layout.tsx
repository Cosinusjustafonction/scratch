//@ts-nocheck
import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";

require("@solana/wallet-adapter-react-ui/styles.css");
import ReactDOM from "react-dom";
import Countdown from "react-countdown";
import { Toaster } from "react-hot-toast";
import { ContextProvider } from "contexts/ContextProvider";

const inter = Ubuntu({ weight: ["300", "400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alien Fungi Pre-Sale Scratch",
  description: "Alien Fungi Pre-Sale Scratch",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="bottom-center" />
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  );
}

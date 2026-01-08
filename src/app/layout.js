import { QuizProvider } from '@/context/QuizContext';
import "./globals.css";

export const metadata = {
  title: "CausalFunnel Quiz",
  description: "Quiz Application Assignment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <QuizProvider>
          {children}
        </QuizProvider>
      </body>
    </html>
  );
}

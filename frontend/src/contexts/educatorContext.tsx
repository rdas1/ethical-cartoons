import { createContext, useContext, useState, ReactNode } from "react";

type EducatorSession = {
  id: number;
  email: string;
  name?: string;
};

type EducatorContextType = {
  educatorSession: EducatorSession | null;
  setEducatorSession: (session: EducatorSession | null) => void;
};

const EducatorContext = createContext<EducatorContextType | undefined>(undefined);

export function EducatorProvider({ children }: { children: ReactNode }) {
  const [educatorSession, setEducatorSession] = useState<EducatorSession | null>(null);

  return (
    <EducatorContext.Provider value={{ educatorSession, setEducatorSession }}>
      {children}
    </EducatorContext.Provider>
  );
}

export function useEducatorContext() {
  const context = useContext(EducatorContext);
  if (!context) {
    throw new Error("useEducatorContext must be used within an EducatorProvider");
  }
  return context;
}

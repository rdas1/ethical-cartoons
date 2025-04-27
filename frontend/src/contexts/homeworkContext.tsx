import { createContext, useContext, useState, ReactNode } from "react";

type HomeworkSession = {
  studentId: number;
  email: string;
  name: string;
  homeworkSlug: string;
};

type HomeworkContextType = {
  homeworkSession: HomeworkSession | null;
  setHomeworkSession: (session: HomeworkSession) => void;
  clearHomeworkSession: () => void;
};

const HomeworkContext = createContext<HomeworkContextType | undefined>(undefined);

export function HomeworkProvider({ children }: { children: ReactNode }) {
  const [homeworkSession, setHomeworkSessionState] = useState<HomeworkSession | null>(null);

  const setHomeworkSession = (session: HomeworkSession) => {
    setHomeworkSessionState(session);
  };

  const clearHomeworkSession = () => {
    setHomeworkSessionState(null);
  };

  return (
    <HomeworkContext.Provider value={{ homeworkSession, setHomeworkSession, clearHomeworkSession }}>
      {children}
    </HomeworkContext.Provider>
  );
}

export function useHomeworkContext() {
  const context = useContext(HomeworkContext);
  if (!context) {
    throw new Error("useHomeworkContext must be used within a HomeworkProvider");
  }
  return context;
}


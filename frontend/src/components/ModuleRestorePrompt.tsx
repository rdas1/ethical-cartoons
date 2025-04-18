import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getSessionId } from "@/utils/session"; // use your existing UUID logic

type ModuleRestorePromptProps = {
  moduleName: string;
  onRestore: (responses: Record<string, string>) => void;
};

export default function ModuleRestorePrompt({ moduleName, onRestore }: ModuleRestorePromptProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [storedResponses, setStoredResponses] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    const sessionId = getSessionId();

    fetch(`/api/module_responses/${moduleName}?session_id=${sessionId}`)
      .then(res => res.json())
      .then(data => {
        console.log("Module response data:", data);
        if (data.responses && Object.keys(data.responses).length > 0) {
          setStoredResponses(data.responses);
          setShowDialog(true);
        }
      });
  }, [moduleName]);

  const handleRestore = () => {
    if (storedResponses) {
      onRestore(storedResponses);
    }
    setShowDialog(false);
  };

  const handleDismiss = () => {
    setShowDialog(false);
  };

  if (!showDialog || !storedResponses) return null;

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>Restore Responses?</DialogTitle>
        </DialogHeader>
        <p>You’ve previously responded to this module. Would you like to restore your answers?</p>
        <DialogFooter className="mt-4">
        <Button onClick={handleRestore} className="btn btn-primary">Restore</Button>
        <Button onClick={handleDismiss} className="btn">Start Fresh</Button>
        </DialogFooter>
    </DialogContent>
    </Dialog>
  );
}

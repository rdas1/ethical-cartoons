import DiscussionPanel from "@/components/DiscussionPanel";

export default function TrolleyVsTransplantDiscussionSection() {
  return (
    <DiscussionPanel
      title="What's the ethical difference between these two scenarios?"
      prompt="In both the Trolley and Transplant dilemmas, you decide whether to sacrifice one person to save five. Yet most people respond to these situations differently. Why? What do you think makes these situations feel so different?"
      commentApiPath="/comments/trolley-vs-transplant"
      onContinue={() => {
        document.getElementById("interpretation-section")?.scrollIntoView({ behavior: "smooth" });
      }}
    />
  );
}
